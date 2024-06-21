import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { ShipmentCost } from './shipment-cost.entity';

@Entity('shipments')
export class Shipment {
  @PrimaryColumn()
  shipment_no: string;

  @Column({ type: "date" })
  shipment_date: string;

  @Column()
  shipment_status: 'RUNNING' | 'DONE' | 'CANCELLED';

  @OneToMany(() => ShipmentCost, (shipmentCost) => shipmentCost.shipment)
  shipmentCosts: ShipmentCost[];
}
