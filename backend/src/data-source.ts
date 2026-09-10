import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

// Load .env file
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  synchronize: false, // Important for production/migrations
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
