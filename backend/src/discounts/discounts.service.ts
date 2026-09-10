import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discount } from './entities/discount.entity.js';
import { CreateDiscountDto } from './dto/create-discount.dto.js';
import { UpdateDiscountDto } from './dto/update-discount.dto.js';
import { GetDiscountsFilterDto } from './dto/get-discounts-filter.dto.js';

@Injectable()
export class DiscountsService {
  constructor(
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
  ) {}

  async create(createDiscountDto: CreateDiscountDto) {
    const existingCode = await this.discountRepository.findOne({ where: { code: createDiscountDto.code } });
    if (existingCode) {
      throw new ConflictException('Discount code already exists');
    }

    const discount = this.discountRepository.create(createDiscountDto);
    return this.discountRepository.save(discount);
  }

  async findAll(filterDto: GetDiscountsFilterDto) {
    const { search, type, status, page = 1, limit = 10 } = filterDto;

    const query = this.discountRepository.createQueryBuilder('discount');

    if (search) {
      query.andWhere(
        '(discount.name ILIKE :search OR discount.code ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (type) {
      query.andWhere('discount.type = :type', { type });
    }

    if (status) {
      query.andWhere('discount.status = :status', { status });
    }

    query.orderBy('discount.created_at', 'DESC');
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
    const discount = await this.discountRepository.findOne({ where: { id } });
    if (!discount) {
      throw new NotFoundException(`Discount with ID ${id} not found`);
    }
    return discount;
  }

  async update(id: string, updateDiscountDto: UpdateDiscountDto) {
    const discount = await this.findOne(id);

    if (updateDiscountDto.code && updateDiscountDto.code !== discount.code) {
      const existingCode = await this.discountRepository.findOne({ where: { code: updateDiscountDto.code } });
      if (existingCode) {
        throw new ConflictException('Discount code already exists');
      }
    }

    Object.assign(discount, updateDiscountDto);
    return this.discountRepository.save(discount);
  }

  async remove(id: string) {
    const discount = await this.findOne(id);
    await this.discountRepository.remove(discount);
  }
}
