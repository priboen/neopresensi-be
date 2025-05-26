import { Sequelize } from "sequelize-typescript";
import { mysqlConfig } from "../configs";
import { Attendance, Permission, User } from "../models";

export const mysqlProvider = {
  provide: 'SEQUELIZE',
  useFactory: async () => {
    const sequelize = new Sequelize(mysqlConfig);
    sequelize.addModels([
      User,
      Attendance,
      Permission
    ]);
    await sequelize.sync();
    return sequelize;
  }
};