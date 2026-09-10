import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, ILike } from 'typeorm';
import { Product } from './entities/product.entity.js';
import { Category } from './entities/category.entity.js';
import { Collection } from './entities/collection.entity.js';
import { ProductImage } from './entities/product-image.entity.js';
import { Inventory } from '../inventory/entities/inventory.entity.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { GetProductsFilterDto } from './dto/get-products-filter.dto.js';
import { ActivityLogService } from '../activity-log/activity-log.service.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
    private readonly activityLogService: ActivityLogService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { category_id, collection_id, sku, ...productData } = createProductDto;

    const existingSku = await this.productRepository.findOne({ where: { sku } });
    if (existingSku) {
      throw new ConflictException('Product with this SKU already exists');
    }

    let category = null;
    if (category_id) {
      category = await this.categoryRepository.findOne({ where: { id: category_id } });
      if (!category) throw new NotFoundException('Category not found');
    }

    let collection = null;
    if (collection_id) {
      collection = await this.collectionRepository.findOne({ where: { id: collection_id } });
      if (!collection) throw new NotFoundException('Collection not found');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = this.productRepository.create({
        ...productData,
        sku,
        category_id,
        collection_id,
      });
      const savedProduct = await queryRunner.manager.save(Product, product);

      // Create a 0-stock inventory record
      const inventory = queryRunner.manager.create(Inventory, {
        product_id: savedProduct.id,
        quantity: 0,
      });
      await queryRunner.manager.save(Inventory, inventory);

      await queryRunner.commitTransaction();
      return this.findOne(savedProduct.id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(filterDto: GetProductsFilterDto) {
    const { category_id, collection_id, status, search, page = 1, limit = 10 } = filterDto;
    
    const query = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.collection', 'collection')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.inventory', 'inventory');

    if (category_id) {
      query.andWhere('product.category_id = :category_id', { category_id });
    }

    if (collection_id) {
      query.andWhere('product.collection_id = :collection_id', { collection_id });
    }

    if (status) {
      query.andWhere('product.status = :status', { status });
    }

    if (search) {
      query.andWhere('(product.name ILIKE :search OR product.sku ILIKE :search)', { search: `%${search}%` });
    }

    query.orderBy('product.created_at', 'DESC');
    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { category: true, collection: true, images: true, inventory: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    
    const { category_id, collection_id, sku, ...updateData } = updateProductDto;

    if (sku && sku !== product.sku) {
      const existingSku = await this.productRepository.findOne({ where: { sku } });
      if (existingSku) {
        throw new ConflictException('Product with this SKU already exists');
      }
      product.sku = sku;
    }

    if (category_id) {
      const category = await this.categoryRepository.findOne({ where: { id: category_id } });
      if (!category) throw new NotFoundException('Category not found');
      product.category_id = category_id;
    }

    if (collection_id) {
      const collection = await this.collectionRepository.findOne({ where: { id: collection_id } });
      if (!collection) throw new NotFoundException('Collection not found');
      product.collection_id = collection_id;
    }

    Object.assign(product, updateData);
    await this.productRepository.save(product);

    return this.findOne(id);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  async addImage(productId: string, url: string) {
    const product = await this.findOne(productId);
    
    const imageCount = await this.productImageRepository.count({ where: { product_id: productId } });
    
    const image = this.productImageRepository.create({
      product_id: productId,
      url,
      sort_order: imageCount,
    });

    return this.productImageRepository.save(image);
  }
}
