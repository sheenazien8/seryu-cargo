import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('variable_configs')
export class VariableConfig {
  @PrimaryColumn()
  key: string;

  @Column('float')
  value: number;
}
