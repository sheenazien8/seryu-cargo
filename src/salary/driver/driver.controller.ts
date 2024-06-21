import { Controller, Get, Query, ValidationPipe } from "@nestjs/common";
import { DriverSalary } from "./interfaces/driver-salary.interface";
import { PaginatedResultDto } from "src/utils/paginated-result.dto";
import { DriverSalaryService } from "./driver.service";
import { DriverSalaryQueryDto } from "./dto/driver-salary-query.dto";
import { ApiQuery } from "@nestjs/swagger";

@Controller('salary/driver')
export class DriverSalaryController {
  constructor(private readonly driversService: DriverSalaryService) { }

  @ApiQuery({ name: 'current', example: 1, description: 'Current page number' })
  @ApiQuery({ name: 'page_size', example: 10, description: 'Number of items per page' })
  @Get('list')
  getList(@Query(new ValidationPipe({
    transform: true
  })) paginationDto: DriverSalaryQueryDto): Promise<PaginatedResultDto<DriverSalary>> {
    return this.driversService.findPaginated(paginationDto);
  }
}

