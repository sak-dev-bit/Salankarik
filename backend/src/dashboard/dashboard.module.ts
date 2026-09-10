import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service.js';
import { DashboardController } from './dashboard.controller.js';
import { Order } from '../orders/entities/order.entity.js';
import { Inventory } from '../inventory/entities/inventory.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Inventory])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
