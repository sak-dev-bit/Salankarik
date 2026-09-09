import type { Relation } from 'typeorm';
import {  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index  } from 'typeorm';
import type { Product } from '../../products/entities/product.entity.js';
import type { User } from '../../users/entities/user.entity.js';

@Entity('inventory_history')
export class InventoryHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'product_id' })
  product_id: string;

  @ManyToOne('Product', (product: any) => product.inventory_history, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Relation<Product>;

  @Column({ type: 'int' })
  change_qty: number;

  @Column({ type: 'int' })
  previous_qty: number;

  @Column({ type: 'int' })
  new_qty: number;

  @Column()
  reason: string;

  @Column({ name: 'admin_id', nullable: true })
  admin_id: string;

  @ManyToOne('User', (user: any) => user.inventory_history, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'admin_id' })
  admin: Relation<User>;

  @CreateDateColumn()
  created_at: Date;
}
