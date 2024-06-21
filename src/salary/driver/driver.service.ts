import { Injectable } from '@nestjs/common';
import { PaginatedResultDto } from 'src/utils/paginated-result.dto';
import { DriverSalary } from './interfaces/driver-salary.interface';
import { DriverSalaryQueryDto } from './dto/driver-salary-query.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver } from '../../entities/driver.entity';
import { DriverAttendance } from '../..//entities/driver-attendance.entity';

@Injectable()
export class DriverSalaryService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverSalaryRepository: Repository<Driver>,
    @InjectRepository(DriverAttendance)
    private readonly attendanceSalary: Repository<DriverAttendance>,
  ) { }
  async findPaginated(driverSalaryDto: DriverSalaryQueryDto): Promise<PaginatedResultDto<DriverSalary>> {
    const {
      month,
      year,
      current,
      page_size,
      driver_code,
      status,
      name,
    } = driverSalaryDto;

    const attendance = await this.attendanceSalary.createQueryBuilder('attendance')
      .select([
        'attendance.driver_code',
        `SUM(CASE WHEN attendance.attendance_status = true THEN config.value ELSE 0 END) as total_attendance_salary_per_date`,
      ])
      .leftJoin('variable_configs', 'config', 'config.key = :configKey', { configKey: 'DRIVER_MONTHLY_ATTENDANCE_SALARY' })
      .where('EXTRACT(YEAR FROM attendance.attendance_date) = :year', { year })
      .andWhere('EXTRACT(MONTH FROM attendance.attendance_date) = :month', { month })
      .groupBy('attendance.driver_code').getRawMany();

    const queryBuilder = this.driverSalaryRepository.createQueryBuilder('driver')
      .leftJoinAndSelect('driver.attendances', 'attendance')
      .leftJoinAndSelect('driver.shipmentCosts', 'shipmentCost')
      .leftJoinAndSelect('shipmentCost.shipment', 'shipment')
      .leftJoin('variable_configs', 'config', 'config.key = :configKey', { configKey: 'DRIVER_MONTHLY_ATTENDANCE_SALARY' })
      .select([
        'driver.driver_code as driver_code',
        'driver.name as name',
        `SUM(CASE WHEN shipmentCost.cost_status = 'PENDING' THEN shipmentCost.total_costs ELSE 0 END) as total_pending`,
        `SUM(CASE WHEN shipmentCost.cost_status = 'CONFIRMED' THEN shipmentCost.total_costs ELSE 0 END) as total_confirmed`,
        `SUM(CASE WHEN shipmentCost.cost_status = 'PAID' THEN shipmentCost.total_costs ELSE 0 END) as total_paid`,
        `SUM(CASE WHEN shipmentCost.cost_status IN ('PENDING', 'CONFIRMED', 'PAID') THEN shipmentCost.total_costs ELSE 0 END) as total_salary`,
        `COUNT(shipment.shipment_no) as count_shipment`
      ])
      .where('EXTRACT(YEAR FROM attendance.attendance_date) = :year', { year })
      .andWhere('EXTRACT(MONTH FROM attendance.attendance_date) = :month', { month })
      .andWhere('shipment.shipment_status != :cancelledStatus', { cancelledStatus: 'CANCELLED' });


    if (driver_code != undefined) {
      queryBuilder.andWhere('driver.driver_code = :driver_code', { driver_code });
    }

    if (name) {
      queryBuilder.andWhere('driver.name LIKE :name', { name: `%${name}%` });
    }

    if (status) {
      switch (status) {
        case 'PENDING':
          queryBuilder.andHaving(`SUM(CASE WHEN shipmentCost.cost_status = 'PENDING' AND shipment.shipment_status != 'CANCELLED' THEN shipmentCost.total_costs ELSE 0 END) > 0`);
          break;
        case 'CONFIRMED':
          queryBuilder.andHaving(`SUM(CASE WHEN shipmentCost.cost_status = 'CONFIRMED' AND shipment.shipment_status != 'CANCELLED' THEN shipmentCost.total_costs ELSE 0 END) > 0`);
          break;
        case 'PAID':
          queryBuilder.andHaving(`SUM(CASE WHEN shipmentCost.cost_status = 'PAID' AND shipment.shipment_status != 'CANCELLED' THEN shipmentCost.total_costs ELSE 0 END) > 0`)
            .andHaving(`SUM(CASE WHEN shipmentCost.cost_status = 'PENDING' AND shipment.shipment_status != 'CANCELLED' THEN shipmentCost.total_costs ELSE 0 END) = 0`)
            .andHaving(`SUM(CASE WHEN shipmentCost.cost_status = 'CONFIRMED' AND shipment.shipment_status != 'CANCELLED' THEN shipmentCost.total_costs ELSE 0 END) = 0`);
          break;
      }
    }

    queryBuilder.andHaving(`SUM(CASE WHEN shipmentCost.cost_status IN ('PENDING', 'CONFIRMED', 'PAID') AND shipment.shipment_status != 'CANCELLED' THEN shipmentCost.total_costs ELSE 0 END) > 0`)
      .groupBy('driver.driver_code')
      .addGroupBy('driver.name')
      .offset((current - 1) * page_size)
      .limit(page_size);

    const result = await queryBuilder.getRawMany();

    const driverSalaries: DriverSalary[] = result.map(function(row) {
      const total_attendance_salary = attendance.filter(att => att.attendance_driver_code == row.driver_code)[0];

      return ({
        driver_code: row.driver_code,
        name: row.name,
        total_pending: parseFloat(row.total_pending),
        total_confirmed: parseFloat(row.total_confirmed),
        total_paid: parseFloat(row.total_paid),
        total_attendance_salary: parseFloat(total_attendance_salary.total_attendance_salary_per_date),
        total_salary: parseFloat(row.total_salary),
        count_shipment: parseInt(row.count_shipment, 10),
      });
    });

    const total_rows = await queryBuilder.getCount();

    return {
      data: driverSalaries,
      total_rows,
      current,
      page_size,
    };
  }
}

