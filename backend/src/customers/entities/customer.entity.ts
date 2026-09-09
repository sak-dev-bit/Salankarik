import type { Relation } from 'typeorm';
import {  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, OneToMany  } from 'typeorm';
import type { Address } from './address.entity.js';
import type { Order } from '../../orders/entities/order.entity.js';
import type { Review } from '../../reviews/entities/review.entity.js';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Index()
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany('Address', (address: any) => address.customer)
  addresses: Relation<Address>[];

  @OneToMany('Order', (order: any) => order.customer)
  orders: Relation<Order>[];

  @OneToMany('Review', (review: any) => review.customer)
  reviews: Relation<Review>[];
}
