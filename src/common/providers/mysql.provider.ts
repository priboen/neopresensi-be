import { Sequelize } from "sequelize-typescript";
import { mysqlConfig } from "../configs";
import { Attendance, Permission, User } from "../models";
import { ConfigService } from "@nestjs/config";

export const mysqlProvider = {
  provide: 'SEQUELIZE',
  useFactory: async (configService: ConfigService) => {
    const sequelize = new Sequelize(mysqlConfig(configService));
    sequelize.addModels([User, Attendance, Permission]);
    try {
      await sequelize.authenticate();
      console.log('Database connection established successfully.');
      await sequelize.sync();
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      throw error;
    }
    return sequelize;
  },
  inject: [ConfigService],
};