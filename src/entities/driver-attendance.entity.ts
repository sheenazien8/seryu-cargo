import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique, JoinColumn } from 'typeorm';
import { Driver } from './driver.entity';

@Entity('driver_attendances')
@Unique(['driver', 'attendance_date'])
export class DriverAttendance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Driver, (driver) => driver.attendances)
  @JoinColumn({ name: "driver_code", referencedColumnName: "driver_code" })
  driver: Driver;

  @Column({ type: "string" })
  driver_code: string;

  @Column({ type: "date" })
  attendance_date: string;

  @Column()
  attendance_status: boolean;
}
