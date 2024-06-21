import { ApiProperty } from "@nestjs/swagger";

export class PaginationDto {
  @ApiProperty({ example: 1, description: 'Current page number' })
  current: number;

  @ApiProperty({ example: 10, description: 'Number of items per page' })
  page_size: number;
}
