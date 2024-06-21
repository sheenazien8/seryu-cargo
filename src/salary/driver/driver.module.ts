import { Module } from '@nestjs/common';
import { DriverSalaryController } from './driver.controller';
import { DriverSalaryService } from './driver.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VariableConfig } from '../../entities/variable-config.entity';
import { ShipmentCost } from '../../entities/shipment-cost.entity';
import { Shipment } from '../../entities/shipment.entity';
import { DriverAttendance } from '../../entities/driver-attendance.entity';
import { Driver } from '../../entities/driver.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Driver,
    DriverAttendance,
    Shipment,
    ShipmentCost,
    VariableConfig
  ])],
  controllers: [DriverSalaryController],
  providers: [DriverSalaryService],
})
export class DriverSalaryModule { }

