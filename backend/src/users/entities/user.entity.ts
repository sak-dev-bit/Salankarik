import type { Relation } from 'typeorm';
import {  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, OneToMany  } from 'typeorm';
import type { InventoryHistory } from '../../inventory/entities/inventory-history.entity.js';
import type { ActivityLog } from '../../activity-log/entities/activity-log.entity.js';

export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Index()
  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STAFF,
  })
  role: UserRole;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany('InventoryHistory', (history: any) => history.admin)
  inventory_history: Relation<InventoryHistory>[];

  @OneToMany('ActivityLog', (log: any) => log.admin)
  activity_logs: Relation<ActivityLog>[];
}
