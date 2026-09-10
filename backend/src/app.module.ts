import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ActivityLogInterceptor } from './activity-log/activity-log.interceptor.js';

import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { CustomersModule } from './customers/customers.module.js';
import { ProductsModule } from './products/products.module.js';
import { InventoryModule } from './inventory/inventory.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { PaymentsModule } from './payments/payments.module.js';
import { DiscountsModule } from './discounts/discounts.module.js';
import { ShipmentsModule } from './shipments/shipments.module.js';
import { ReviewsModule } from './reviews/reviews.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { ActivityLogModule } from './activity-log/activity-log.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        ssl: {
          rejectUnauthorized: false, // For Neon DB
        },
        entities: ['dist/**/*.entity.js'],
        autoLoadEntities: false,
        synchronize: false, // Migrations used instead
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    CustomersModule,
    ProductsModule,
    InventoryModule,
    OrdersModule,
    PaymentsModule,
    DiscountsModule,
    ShipmentsModule,
    ReviewsModule,
    DashboardModule,
    ActivityLogModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ActivityLogInterceptor,
    },
  ],
})
export class AppModule {}
