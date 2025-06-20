import { Inject, Injectable } from '@nestjs/common';
import {
  CreateScheduleDto,
  ResponseDto,
  UpdateScheduleDto,
} from 'src/common/dto';
import {
  Classes,
  ClassGroup,
  Schedule,
  Subject,
  TeacherAssignment,
  User,
} from 'src/common/models';

@Injectable()
export class SchedulesService {
  constructor(
    @Inject('SCHEDULE_REPOSITORY')
    private readonly scheduleRepository: typeof Schedule,
    @Inject('TEACHER_ASSIGNMENT_REPOSITORY')
    private readonly teacherAssignmentRepository: typeof TeacherAssignment,
  ) {}

  // async findAll(): Promise<ResponseDto<Schedule[]>> {
  //   try {
  //     const schedules = await this.scheduleRepository.findAll({
  //       include: [
  //         {
  //           model: TeacherAssignment,
  //           as: 'teacherAssignment',
  //           include: [
  //             {
  //               model: Subject,
  //               as: 'subject',
  //               attributes: ['name'],
  //             },
  //             {
  //               model: Classes,
  //               as: 'classes',
  //               attributes: ['grade'],
  //             },
  //             {
  //               model: User,
  //               as: 'user',
  //               attributes: ['name'],
  //             },
  //           ],
  //         },
  //       ],
  //       order: [
  //         ['day', 'ASC'],
  //         ['start_time', 'ASC'],
  //         ['end_time', 'ASC'],
  //         [
  //           { model: TeacherAssignment, as: 'teacherAssignment' },
  //           { model: Subject, as: 'subject' },
  //           'name',
  //           'ASC',
  //         ],
  //         [
  //           { model: TeacherAssignment, as: 'teacherAssignment' },
  //           { model: Classes, as: 'classes' },
  //           'grade',
  //           'ASC',
  //         ],
  //         [
  //           { model: TeacherAssignment, as: 'teacherAssignment' },
  //           { model: User, as: 'user' },
  //           'name',
  //           'ASC',
  //         ],
  //       ],
  //     });
  //     return new ResponseDto({
  //       statusCode: 200,
  //       message: 'Schedules fetched successfully',
  //       data: schedules,
  //     });
  //   } catch (error) {
  //     throw new ResponseDto({
  //       statusCode: 500,
  //       message: 'Error fetching schedules: ' + error.message,
  //     });
  //   }
  // }

  async findAll(): Promise<ResponseDto<Schedule[]>> {
    try {
      const schedules = await this.scheduleRepository.findAll({
        include: [
          {
            model: TeacherAssignment,
            as: 'teacherAssignment',
            include: [
              {
                model: Subject,
                as: 'subject',
                attributes: ['name'],
              },
              {
                model: Classes,
                as: 'classes', // Ensure the 'classes' alias is correct
                include: [
                  {
                    model: ClassGroup,
                    as: 'group', // Ensure 'group' alias is correctly set
                    attributes: ['name'],
                  },
                ],
              },
              {
                model: User,
                as: 'user',
                attributes: ['name'],
              },
            ],
          },
        ],
        order: [
          ['day', 'ASC'],
          ['start_time', 'ASC'],
          ['end_time', 'ASC'],
          [
            { model: TeacherAssignment, as: 'teacherAssignment' },
            { model: Subject, as: 'subject' },
            'name',
            'ASC',
          ],
          [
            { model: TeacherAssignment, as: 'teacherAssignment' },
            { model: Classes, as: 'classes' },
            'grade',
            'ASC',
          ],
          [
            { model: TeacherAssignment, as: 'teacherAssignment' },
            { model: User, as: 'user' },
            'name',
            'ASC',
          ],
        ],
      });

      console.log('Fetched Schedules:', JSON.stringify(schedules, null, 2)); // Log the raw fetched data

      // Map the result to modify the 'classes' field as required
      const modifiedSchedules = schedules.map((schedule) => {
        const teacherAssignment = schedule.getDataValue('teacherAssignment');
        const classes = teacherAssignment?.getDataValue('classes'); // Use getDataValue to extract classes

        console.log('Teacher Assignment:', teacherAssignment); // Log teacherAssignment data
        console.log('Classes:', classes); // Log classes data

        // Safely access grade and group name
        const grade = classes?.getDataValue('grade');
        const groupName = classes?.getDataValue('group')?.getDataValue('name');

        // Concatenate grade and group name into a single string for 'gradeGroup'
        const gradeGroup = grade && groupName ? `${grade} ${groupName}` : 'N/A';

        console.log('Grade Group:', gradeGroup);

        // Modify the schedule object to include the gradeGroup
        return {
          ...schedule.toJSON(), // Ensure the sequelize instance is converted to a plain object
          teacherAssignment: {
            ...teacherAssignment?.toJSON(), // Flatten teacherAssignment if it exists
            classes: { gradeGroup }, // Replace 'classes' with 'gradeGroup'
          },
        };
      });

      return new ResponseDto({
        statusCode: 200,
        message: 'Schedules fetched successfully',
        data: modifiedSchedules,
      });
    } catch (error) {
      console.error('Error fetching schedules:', error); // Log the error for debugging
      throw new ResponseDto({
        statusCode: 500,
        message: 'Error fetching schedules: ' + error.message,
      });
    }
  }

  async create(data: CreateScheduleDto): Promise<ResponseDto<Schedule>> {
    try {
      const teacherAssignment = await this.teacherAssignmentRepository.findOne({
        where: { uuid: data.teacher_id }, // Correct table for teacher assignments
      });
      if (!teacherAssignment) {
        return new ResponseDto({
          statusCode: 400,
          message: 'Teacher not found in the teacher assignments table',
        });
      }
      const existsSchedule = await this.scheduleRepository.findOne({
        where: {
          day: data.day,
          start_time: data.start_time,
          end_time: data.end_time,
          teacher_id: teacherAssignment.getDataValue('uuid'),
        },
      })
      if( existsSchedule) {
        throw new ResponseDto({
          statusCode: 409,
          message: 'Schedule already exists for this time slot',
        })
      }
      const schedule = await this.scheduleRepository.create({ ...data });
      if (!schedule) {
        return new ResponseDto({
          statusCode: 400,
          message: 'Failed to create schedule',
        });
      }
      return new ResponseDto({
        statusCode: 201,
        message: 'Schedule created successfully',
        data: schedule,
      });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return new ResponseDto({
          statusCode: 400,
          message: 'Schedule with this name already exists',
        });
      }
      throw new ResponseDto({
        statusCode: 500,
        message: 'Error creating schedule: ' + error.message,
      });
    }
  }

  async delete(uuid: string): Promise<ResponseDto<Schedule>> {
    try {
      const schedule = await this.scheduleRepository.findOne({
        where: { uuid },
      });
      if (!schedule) {
        return new ResponseDto({
          statusCode: 404,
          message: 'Schedule not found',
        });
      }
      await schedule.destroy();
      return new ResponseDto<Schedule>({
        statusCode: 200,
        message: 'Schedule deleted successfully',
      });
    } catch (error) {
      return new ResponseDto({
        statusCode: 500,
        message: 'Internal server error',
        data: error.message,
      });
    }
  }

  async update(
    uuid: string,
    data: UpdateScheduleDto,
  ): Promise<ResponseDto<Schedule>> {
    try {
      const schedule = await this.scheduleRepository.findOne({
        where: { uuid },
      });
      if (!schedule) {
        return new ResponseDto({
          statusCode: 404,
          message: 'Schedule not found',
        });
      }
      await schedule.update({ ...data });
      return new ResponseDto({
        statusCode: 200,
        message: 'Schedule updated successfully',
        data: schedule,
      });
    } catch (error) {
      throw new ResponseDto({
        statusCode: 500,
        message: 'Error updating schedule: ' + error.message,
      });
    }
  }
}
