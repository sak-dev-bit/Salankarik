import type { Relation } from 'typeorm';
import {  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany, Index, OneToOne  } from 'typeorm';
import type { Customer } from '../../customers/entities/customer.entity.js';
import type { OrderItem } from './order-item.entity.js';
import type { Payment } from '../../payments/entities/payment.entity.js';
import type { Shipment } from '../../shipments/entities/shipment.entity.js';

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ unique: true })
  order_number: string;

  @Index()
  @Column({ name: 'customer_id' })
  customer_id: string;

  @ManyToOne('Customer', (customer: any) => customer.orders, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'customer_id' })
  customer: Relation<Customer>;

  @Index()
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  payment_status: PaymentStatus;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  subtotal: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  discount: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  shipping: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  tax: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  total: number;

  @Index()
  @CreateDateColumn()
  created_at: Date;

  @OneToMany('OrderItem', (item: any) => item.order)
  items: Relation<OrderItem>[];

  @OneToOne('Payment', (payment: any) => payment.order)
  payment: Relation<Payment>;

  @OneToOne('Shipment', (shipment: any) => shipment.order)
  shipment: Relation<Shipment>;
}
