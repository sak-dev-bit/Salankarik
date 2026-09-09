import type { Relation } from 'typeorm';
import {  Entity, PrimaryGeneratedColumn, Column, OneToMany  } from 'typeorm';
import type { Product } from './product.entity.js';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @OneToMany('Product', (product: any) => product.category)
  products: Relation<Product>[];
}
