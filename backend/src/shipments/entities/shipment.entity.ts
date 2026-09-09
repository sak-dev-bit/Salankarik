import type { Relation } from 'typeorm';
import {  Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Index, CreateDateColumn, UpdateDateColumn  } from 'typeorm';
import type { Order } from '../../orders/entities/order.entity.js';

export enum ShipmentStatus {
  PENDING = 'pending',
  DISPATCHED = 'dispatched',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  RETURNED = 'returned',
}

@Entity('shipments')
export class Shipment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'order_id', unique: true })
  order_id: string;

  @OneToOne('Order', (order: any) => order.shipment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Relation<Order>;

  @Column({ nullable: true })
  courier: string;

  @Column({ nullable: true })
  tracking_number: string;

  @Column({
    type: 'enum',
    enum: ShipmentStatus,
    default: ShipmentStatus.PENDING,
  })
  status: ShipmentStatus;

  @Column({ type: 'timestamp', nullable: true })
  estimated_delivery: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
