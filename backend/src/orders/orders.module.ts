import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service.js';
import { OrdersController } from './orders.controller.js';
import { Order } from './entities/order.entity.js';
import { OrderItem } from './entities/order-item.entity.js';
import { Payment } from '../payments/entities/payment.entity.js';
import { Shipment } from '../shipments/entities/shipment.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Payment, Shipment])],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
