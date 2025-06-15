import { Sequelize } from 'sequelize-typescript';
import { mysqlConfig } from '../configs';
import {
  Attendance,
  CCTVConfig,
  CCTVSchedule,
  Classes,
  ClassGroup,
  Meeting,
  MeetingAttendance,
  MeetingInvitation,
  Permission,
  Schedule,
  Subject,
  TeacherAssignment,
  User,
} from '../models';
import { ConfigService } from '@nestjs/config';

export const mysqlProvider = {
  provide: 'SEQUELIZE',
  useFactory: async (configService: ConfigService) => {
    const sequelize = new Sequelize(mysqlConfig(configService));
    sequelize.addModels([
      User,
      Attendance,
      Permission,
      TeacherAssignment,
      ClassGroup,
      Classes,
      Subject,
      Schedule,
      CCTVConfig,
      CCTVSchedule,
      MeetingAttendance,
      Meeting,
      MeetingInvitation
    ]);
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
