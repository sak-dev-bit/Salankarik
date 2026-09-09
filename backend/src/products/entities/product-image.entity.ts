import type { Relation } from 'typeorm';
import {  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn  } from 'typeorm';
import { Product } from './product.entity.js';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'product_id' })
  product_id: string;

  @ManyToOne('Product', (product: any) => product.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Relation<Product>;

  @Column()
  url: string;

  @Column({ type: 'int', default: 0 })
  sort_order: number;
}
