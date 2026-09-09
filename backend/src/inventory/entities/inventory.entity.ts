import type { Relation } from 'typeorm';
import {  Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Index  } from 'typeorm';
import type { Product } from '../../products/entities/product.entity.js';

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'product_id', unique: true })
  product_id: string;

  @OneToOne('Product', (product: any) => product.inventory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Relation<Product>;

  @Column({ type: 'int', default: 0 })
  stock_quantity: number;

  @Column({ type: 'int', default: 0 })
  reserved_quantity: number;

  @Column({ type: 'int', default: 5 })
  low_stock_threshold: number;
}
