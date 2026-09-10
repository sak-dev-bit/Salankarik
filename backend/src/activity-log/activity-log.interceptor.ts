import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ActivityLogService } from './activity-log.service.js';

@Injectable()
export class ActivityLogInterceptor implements NestInterceptor {
  constructor(private readonly activityLogService: ActivityLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, user, body } = req;

    // Only log mutations (POST, PATCH, DELETE)
    if (['POST', 'PATCH', 'DELETE'].includes(method)) {
      const entity = url.split('/')[1] || 'unknown';
      const action = method === 'POST' ? 'CREATE' : method === 'PATCH' ? 'UPDATE' : 'DELETE';
      
      const adminId = user ? user.id : null;

      // Log asynchronously after the request completes successfully
      return next.handle().pipe(
        tap((data) => {
          this.activityLogService.log({
            admin_id: adminId,
            action,
            entity,
            new_value: method !== 'DELETE' ? (data || body) : null,
          }).catch(err => console.error('Failed to log activity:', err));
        }),
      );
    }

    return next.handle();
  }
}
