export class LogActivityDto {
  admin_id: string;
  action: string;
  entity: string;
  previous_value?: Record<string, any>;
  new_value?: Record<string, any>;
}
