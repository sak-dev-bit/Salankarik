import 'dotenv/config';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from './data-source.js';

import { User, UserRole } from './users/entities/user.entity.js';
import { Customer } from './customers/entities/customer.entity.js';
import { Category } from './products/entities/category.entity.js';
import { Collection } from './products/entities/collection.entity.js';
import { Product, ProductStatus } from './products/entities/product.entity.js';
import { Inventory } from './inventory/entities/inventory.entity.js';
import { Order, OrderStatus } from './orders/entities/order.entity.js';

import bcrypt from 'bcrypt';

async function runSeed() {
  console.log('Connecting to database...');
  const AppDataSource = new DataSource(dataSourceOptions);
  await AppDataSource.initialize();
  console.log('Connected!');

  try {
    // 1. Create User
    const userRepository = AppDataSource.getRepository(User);
    if ((await userRepository.count()) === 0) {
      const password_hash = await bcrypt.hash('password123', 10);
      await userRepository.save([
        {
          name: 'Admin User (Seed)',
          email: 'admin@salankarik.test',
          password_hash,
          role: UserRole.ADMIN,
        },
      ]);
      console.log('Seeded Users');
    }

    // 2. Create Customers
    const customerRepo = AppDataSource.getRepository(Customer);
    if ((await customerRepo.count()) === 0) {
      await customerRepo.save([
        { name: 'John Doe', email: 'john@example.com', phone: '1234567890' },
        { name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321' },
        { name: 'Alice Johnson', email: 'alice@example.com' },
      ]);
      console.log('Seeded Customers');
    }

    // 3. Create Categories & Collections
    const categoryRepo = AppDataSource.getRepository(Category);
    let cat1, cat2;
    if ((await categoryRepo.count()) === 0) {
      const cats = await categoryRepo.save([
        { name: 'Rings', slug: 'rings' },
        { name: 'Necklaces', slug: 'necklaces' },
      ]);
      cat1 = cats[0];
      cat2 = cats[1];
      console.log('Seeded Categories');
    } else {
      cat1 = await categoryRepo.findOne({ where: { slug: 'rings' } });
      cat2 = await categoryRepo.findOne({ where: { slug: 'necklaces' } });
    }

    const collectionRepo = AppDataSource.getRepository(Collection);
    let col1;
    if ((await collectionRepo.count()) === 0) {
      col1 = await collectionRepo.save({ name: 'Summer Collection', slug: 'summer-collection' });
      console.log('Seeded Collections');
    } else {
      col1 = await collectionRepo.findOne({ where: { slug: 'summer-collection' } });
    }

    // 4. Create Products & Inventory
    const productRepo = AppDataSource.getRepository(Product);
    const inventoryRepo = AppDataSource.getRepository(Inventory);
    
    if ((await productRepo.count()) === 0) {
      const productsData = [
        { name: 'Diamond Solitaire Ring', sku: 'RNG-001', category: cat1, collection: col1, description: 'Beautiful ring', price: 999.99, cost_price: 500, material: 'Gold', metal_type: '18k', purity: '75%', weight: 5.5, status: ProductStatus.ACTIVE },
        { name: 'Gold Chain Necklace', sku: 'NCK-001', category: cat2, description: 'Classic gold chain', price: 499.99, cost_price: 200, material: 'Gold', metal_type: '22k', purity: '91.6%', weight: 15.0, status: ProductStatus.ACTIVE },
        { name: 'Silver Charm Ring', sku: 'RNG-002', category: cat1, description: 'Cute silver ring', price: 49.99, cost_price: 15, material: 'Silver', metal_type: '925', purity: '92.5%', weight: 3.2, status: ProductStatus.ACTIVE },
        { name: 'Ruby Pendant', sku: 'NCK-002', category: cat2, collection: col1, description: 'Red ruby pendant', price: 799.00, cost_price: 350, material: 'Gold', metal_type: '18k', stone_type: 'Ruby', status: ProductStatus.ACTIVE },
        { name: 'Platinum Band', sku: 'RNG-003', category: cat1, description: 'Simple platinum band', price: 1200.00, cost_price: 800, material: 'Platinum', metal_type: '950', status: ProductStatus.ACTIVE },
      ];

      const savedProducts = await productRepo.save(productsData as any);
      console.log('Seeded Products');

      const inventories = savedProducts.map((p: any) => ({
        product_id: p.id,
        stock_quantity: Math.floor(Math.random() * 50) + 10,
      }));
      await inventoryRepo.save(inventories);
      console.log('Seeded Inventory');
    }

    // 5. Create Orders
    const orderRepo = AppDataSource.getRepository(Order);
    if ((await orderRepo.count()) === 0) {
      const customers = await customerRepo.find();
      const orders = [
        { order_number: 'ORD-1001', customer: customers[0], status: OrderStatus.PENDING, total: 999.99 },
        { order_number: 'ORD-1002', customer: customers[1], status: OrderStatus.SHIPPED, total: 499.99 },
        { order_number: 'ORD-1003', customer: customers[2], status: OrderStatus.DELIVERED, total: 1200.00 },
        { order_number: 'ORD-1004', customer: customers[0], status: OrderStatus.PROCESSING, total: 49.99 },
        { order_number: 'ORD-1005', customer: customers[1], status: OrderStatus.PENDING, total: 799.00 },
      ];
      await orderRepo.save(orders);
      console.log('Seeded Orders');
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

runSeed();
