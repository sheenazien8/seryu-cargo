import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { DriverAttendance } from './driver-attendance.entity';
import { ShipmentCost } from './shipment-cost.entity';

@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  driver_code: string;

  @Column()
  name: string;

  @OneToMany(() => DriverAttendance, (attendance) => attendance.driver)
  attendances: DriverAttendance[];

  @OneToMany(() => ShipmentCost, (shipmentCost) => shipmentCost.driver)
  shipmentCosts: ShipmentCost[];
}

