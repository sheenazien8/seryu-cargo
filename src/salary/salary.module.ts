import { Module } from '@nestjs/common';
import { DriverSalaryModule } from './driver/driver.module';

@Module({
  imports: [DriverSalaryModule],
})

export class SalaryModule { }

