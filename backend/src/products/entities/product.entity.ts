import type { Relation } from 'typeorm';
import {  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany, Index, OneToOne  } from 'typeorm';
import type { Category } from './category.entity.js';
import type { Collection } from './collection.entity.js';
import type { ProductImage } from './product-image.entity.js';
import type { Inventory } from '../../inventory/entities/inventory.entity.js';
import type { InventoryHistory } from '../../inventory/entities/inventory-history.entity.js';
import type { OrderItem } from '../../orders/entities/order-item.entity.js';
import type { Review } from '../../reviews/entities/review.entity.js';

export enum ProductStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Index()
  @Column({ unique: true })
  sku: string;

  @Column({ name: 'category_id', nullable: true })
  category_id: string;

  @ManyToOne('Category', (category: any) => category.products, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: Relation<Category>;

  @Column({ name: 'collection_id', nullable: true })
  collection_id: string;

  @ManyToOne('Collection', (collection: any) => collection.products, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'collection_id' })
  collection: Relation<Collection>;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  sale_price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  cost_price: number;

  @Column({ nullable: true })
  material: string;

  @Column({ nullable: true })
  metal_type: string;

  @Column({ nullable: true })
  purity: string;

  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  weight: number;

  @Column({ nullable: true })
  stone_type: string;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.DRAFT,
  })
  status: ProductStatus;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany('ProductImage', (image: any) => image.product)
  images: Relation<ProductImage>[];

  @OneToOne('Inventory', (inventory: any) => inventory.product)
  inventory: Relation<Inventory>;

  @OneToMany('InventoryHistory', (history: any) => history.product)
  inventory_history: Relation<InventoryHistory>[];

  @OneToMany('OrderItem', (item: any) => item.product)
  order_items: Relation<OrderItem>[];

  @OneToMany('Review', (review: any) => review.product)
  reviews: Relation<Review>[];
}
