import { createConnection } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import app from '../config/app';

import * as fs from 'fs';
import * as path from 'path';
import * as csvParser from 'csv-parser';
import { Driver } from '../entities/driver.entity';
import { DriverAttendance } from '../entities/driver-attendance.entity';
import { Shipment } from '../entities/shipment.entity';
import { ShipmentCost } from '../entities/shipment-cost.entity';
import { VariableConfig } from '../entities/variable-config.entity';

async function readCSV(filePath: string) {
  return new Promise<any[]>((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

async function seed() {
  ConfigModule.forRoot({
    load: [app],
  });

  // Create an instance of ConfigService
  const configService = new ConfigService(app());

  // Get database configuration
  const dbConfig = configService.get('database');

  const connection = await createConnection({
    type: 'postgres',
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    entities: [Driver, DriverAttendance, Shipment, ShipmentCost, VariableConfig],
    synchronize: dbConfig.synchronize,
  });

  const driverRepository = connection.getRepository(Driver);
  const attendanceRepository = connection.getRepository(DriverAttendance);
  const shipmentRepository = connection.getRepository(Shipment);
  const shipmentCostRepository = connection.getRepository(ShipmentCost);
  const variableConfigRepository = connection.getRepository(VariableConfig);

  const drivers = await readCSV(path.join(__dirname, 'data', 'drivers.csv'));
  const attendances = await readCSV(path.join(__dirname, 'data', 'driver_attendances.csv'));
  const shipments = await readCSV(path.join(__dirname, 'data', 'shipments.csv'));
  const shipmentCosts = await readCSV(path.join(__dirname, 'data', 'shipment_costs.csv'));
  const variableConfigs = await readCSV(path.join(__dirname, 'data', 'variable_configs.csv'));

  await driverRepository.save(drivers);
  await attendanceRepository.save(attendances);
  await shipmentRepository.save(shipments);
  await shipmentCostRepository.save(shipmentCosts);
  await variableConfigRepository.save(variableConfigs);

  console.log('Seeding complete!');
  await connection.close();
}

seed().catch((error) => console.error(error));

