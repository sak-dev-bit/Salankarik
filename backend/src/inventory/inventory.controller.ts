import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service.js';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto.js';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '../users/entities/user.entity.js';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN, UserRole.STAFF)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get('history')
  getHistory(@Query('product_id') productId?: string) {
    return this.inventoryService.getHistory(productId);
  }

  @Patch(':productId')
  adjustStock(
    @Param('productId') productId: string,
    @Body() adjustInventoryDto: AdjustInventoryDto,
    @Request() req: any,
  ) {
    return this.inventoryService.adjustStock(productId, req.user.id, adjustInventoryDto);
  }
}
