import { Module } from '@nestjs/common';
import { SalaryModule } from './salary/salary.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import app from './config/app';
import { Driver } from './entities/driver.entity';
import { DriverAttendance } from './entities/driver-attendance.entity';
import { Shipment } from './entities/shipment.entity';
import { ShipmentCost } from './entities/shipment-cost.entity';
import { VariableConfig } from './entities/variable-config.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [app],
    }),
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule,
      ],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: [Driver, DriverAttendance, Shipment, ShipmentCost, VariableConfig],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    SalaryModule
  ],
})
export class AppModule { }


