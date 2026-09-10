import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../orders/entities/order.entity.js';
import { Inventory } from '../inventory/entities/inventory.entity.js';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
  ) {}

  async getKpis() {
    // Total Revenue (all time, not cancelled)
    const { total_revenue } = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'total_revenue')
      .where('order.status != :cancelled', { cancelled: OrderStatus.CANCELLED })
      .getRawOne();

    // Total Orders Count
    const total_orders = await this.orderRepository.count();

    // Today's Sales
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { today_sales } = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'today_sales')
      .where('order.status != :cancelled', { cancelled: OrderStatus.CANCELLED })
      .andWhere('order.created_at >= :today', { today })
      .getRawOne();

    // Low Stock Alert Count
    const low_stock_count = await this.inventoryRepository
      .createQueryBuilder('inventory')
      .where('inventory.stock_quantity <= inventory.low_stock_threshold')
      .getCount();

    return {
      totalRevenue: total_revenue ? parseFloat(total_revenue) : 0,
      totalOrders: total_orders,
      todaySales: today_sales ? parseFloat(today_sales) : 0,
      lowStockCount: low_stock_count,
    };
  }

  async getLowStockItems() {
    return this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.product', 'product')
      .where('inventory.stock_quantity <= inventory.low_stock_threshold')
      .getMany();
  }
}
