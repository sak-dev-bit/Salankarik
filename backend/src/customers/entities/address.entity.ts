import type { Relation } from 'typeorm';
import {  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn  } from 'typeorm';
import type { Customer } from './customer.entity.js';

export enum AddressType {
  SHIPPING = 'shipping',
  BILLING = 'billing',
}

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'customer_id' })
  customer_id: string;

  @ManyToOne('Customer', (customer: any) => customer.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer: Relation<Customer>;

  @Column({
    type: 'enum',
    enum: AddressType,
  })
  type: AddressType;

  @Column()
  line1: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  pincode: string;
}
