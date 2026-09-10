import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from './entities/activity-log.entity.js';
import { LogActivityDto } from './dto/log-activity.dto.js';
import { GetLogsFilterDto } from './dto/get-logs-filter.dto.js';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
  ) {}

  async log(dto: LogActivityDto) {
    const logEntry = this.activityLogRepository.create(dto);
    return this.activityLogRepository.save(logEntry);
  }

  async findAll(filterDto: GetLogsFilterDto) {
    const { entity, action, page = 1, limit = 20 } = filterDto;

    const query = this.activityLogRepository.createQueryBuilder('log')
      .leftJoinAndSelect('log.admin', 'admin');

    if (entity) {
      query.andWhere('log.entity = :entity', { entity });
    }

    if (action) {
      query.andWhere('log.action = :action', { action });
    }

    query.orderBy('log.created_at', 'DESC');
    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();

    // Sanitize admin password hashes
    data.forEach(log => {
      if (log.admin && log.admin.password_hash) {
        delete (log.admin as any).password_hash;
      }
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
