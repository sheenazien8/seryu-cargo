import { IsInt, Min, IsNotEmpty, Max, IsEnum, IsEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../utils/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from './status.enum';

export class DriverSalaryQueryDto extends PaginationDto {
  @ApiProperty({ example: 3, description: 'Month for the salary query' })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(12)
  readonly month: number;

  @ApiProperty({ example: 2024, description: 'Year for the salary query' })
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  @Min(1997)
  readonly year: number;

  @ApiProperty({ example: 'DRIVER001', description: 'Get the specific payroll of a driver', required: false })
  @Type(() => String)
  readonly driver_code: string;

  @ApiProperty({ example: 'PENDING', description: 'Get the specific status shipment cost of a driver', required: false })
  @IsEnum(Status)
  @Type(() => String)
  readonly status: 'PENDING' | 'CONFIRMED' | 'PAID';

  @ApiProperty({ example: 'Driver 1', description: 'Filters driver name that contains this string', required: false })
  @Type(() => String)
  readonly name: string;
}
