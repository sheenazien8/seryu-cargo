import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique, JoinColumn } from 'typeorm';
import { Driver } from './driver.entity';
import { Shipment } from './shipment.entity';

@Entity('shipment_costs')
@Unique(['driver', 'shipment'])
export class ShipmentCost {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Driver, (driver) => driver.shipmentCosts)
  @JoinColumn({ name: "driver_code", referencedColumnName: "driver_code" })
  driver: Driver;

  @ManyToOne(() => Shipment, (shipment) => shipment.shipmentCosts)
  @JoinColumn({ name: "shipment_no", referencedColumnName: "shipment_no" })
  shipment: Shipment;

  @Column()
  driver_code: string;

  @Column()
  shipment_no: string;

  @Column({ type: "float" })
  total_costs: number;

  @Column()
  cost_status: 'PENDING' | 'CONFIRMED' | 'PAID';
}
