import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryService } from './inventory.service.js';
import { InventoryController } from './inventory.controller.js';
import { Inventory } from './entities/inventory.entity.js';
import { InventoryHistory } from './entities/inventory-history.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory, InventoryHistory])],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
