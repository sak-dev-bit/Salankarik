import type { Relation } from 'typeorm';
import {  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn  } from 'typeorm';
import type { User } from '../../users/entities/user.entity.js';

@Entity('activity_log')
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'admin_id', nullable: true })
  admin_id: string;

  @ManyToOne('User', (user: any) => user.activity_logs, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'admin_id' })
  admin: Relation<User>;

  @Column()
  action: string;

  @Column()
  entity: string;

  @Column('jsonb', { nullable: true })
  previous_value: Record<string, any>;

  @Column('jsonb', { nullable: true })
  new_value: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;
}
