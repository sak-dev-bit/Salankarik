import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity.js';
import { GetPaymentsFilterDto } from './dto/get-payments-filter.dto.js';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async findAll(filterDto: GetPaymentsFilterDto) {
    const { status, method, page = 1, limit = 10 } = filterDto;

    const query = this.paymentRepository.createQueryBuilder('payment')
      .leftJoinAndSelect('payment.order', 'order')
      .leftJoinAndSelect('order.customer', 'customer');

    if (status) {
      query.andWhere('payment.status = :status', { status });
    }

    if (method) {
      query.andWhere('payment.method = :method', { method });
    }

    query.orderBy('payment.created_at', 'DESC');
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
}
