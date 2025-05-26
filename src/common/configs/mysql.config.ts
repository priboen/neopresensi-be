import { ConfigService } from "@nestjs/config";
import { SequelizeOptions } from "sequelize-typescript";

export const mysqlConfig = (configService: ConfigService): SequelizeOptions => ({
  dialect: 'mysql',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
});