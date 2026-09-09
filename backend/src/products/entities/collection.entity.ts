import type { Relation } from 'typeorm';
import {  Entity, PrimaryGeneratedColumn, Column, OneToMany  } from 'typeorm';
import type { Product } from './product.entity.js';

@Entity('collections')
export class Collection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @OneToMany('Product', (product: any) => product.collection)
  products: Relation<Product>[];
}
