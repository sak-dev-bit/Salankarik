import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Inventory } from './entities/inventory.entity.js';
import { InventoryHistory } from './entities/inventory-history.entity.js';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto.js';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(InventoryHistory)
    private readonly historyRepository: Repository<InventoryHistory>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll() {
    return this.inventoryRepository.find({
      relations: { product: true },
    });
  }

  async getHistory(productId?: string) {
    const where = productId ? { product_id: productId } : {};
    return this.historyRepository.find({
      where,
      relations: { product: true, admin: true },
      select: {
        id: true,
        product_id: true,
        change_qty: true,
        previous_qty: true,
        new_qty: true,
        reason: true,
        admin_id: true,
        created_at: true,
        product: { id: true, name: true, sku: true },
        admin: { id: true, name: true, email: true, role: true },
      },
      order: { created_at: 'DESC' },
    });
  }

  async adjustStock(productId: string, adminId: string, adjustDto: AdjustInventoryDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Read current stock
      const inventory = await queryRunner.manager.findOne(Inventory, {
        where: { product_id: productId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!inventory) {
        throw new NotFoundException('Inventory not found for this product');
      }

      const previousQty = inventory.stock_quantity;
      
      // 2. Calculate new stock
      const newQty = previousQty + adjustDto.change_qty;
      
      if (newQty < 0) {
        throw new BadRequestException('Cannot reduce stock below zero');
      }

      // 3. Update inventory
      inventory.stock_quantity = newQty;
      await queryRunner.manager.save(Inventory, inventory);

      // 4. Create history record
      const history = queryRunner.manager.create(InventoryHistory, {
        product_id: productId,
        admin_id: adminId,
        previous_qty: previousQty,
        change_qty: adjustDto.change_qty,
        new_qty: newQty,
        reason: adjustDto.reason,
      });
      await queryRunner.manager.save(InventoryHistory, history);

      await queryRunner.commitTransaction();
      
      return inventory;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
