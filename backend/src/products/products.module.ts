import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service.js';
import { ProductsController } from './products.controller.js';
import { Product } from './entities/product.entity.js';
import { Category } from './entities/category.entity.js';
import { Collection } from './entities/collection.entity.js';
import { ProductImage } from './entities/product-image.entity.js';
import { Inventory } from '../inventory/entities/inventory.entity.js';
import { CloudinaryModule } from '../cloudinary/cloudinary.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, Collection, ProductImage, Inventory]),
    CloudinaryModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
