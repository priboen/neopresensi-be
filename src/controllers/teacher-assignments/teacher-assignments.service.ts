import { Inject, Injectable } from '@nestjs/common';
import {
  CreateTeacherAssignmentDto,
  ResponseDto,
  UpdateTeacherAssignmentDto,
} from 'src/common/dto';
import {
  Classes,
  ClassGroup,
  Subject,
  TeacherAssignment,
  User,
} from 'src/common/models';

@Injectable()
export class TeacherAssignmentsService {
  constructor(
    @Inject('TEACHER_ASSIGNMENT_REPOSITORY')
    private readonly teacherRepository: typeof TeacherAssignment,
  ) {}

  async findAll(): Promise<ResponseDto<TeacherAssignment[]>> {
    try {
      const teacherAssignments = await this.teacherRepository.findAll({
        include: [
          {
            model: User,
            attributes: ['name', 'photo_url'],
          },
          {
            model: Subject,
            attributes: ['name'],
          },
          {
            model: Classes,
            attributes: ['grade'],
            include: [
              {
                model: ClassGroup,
                attributes: ['name'],
              },
            ],
          },
        ],
      });
      return new ResponseDto({
        statusCode: 200,
        message: 'Teacher assignments fetched successfully',
        data: teacherAssignments,
      });
    } catch (error) {
      throw new ResponseDto({
        statusCode: 500,
        message: 'Error fetching teacher assignments: ' + error.message,
      });
    }
  }

  async create(
    data: CreateTeacherAssignmentDto,
  ): Promise<ResponseDto<TeacherAssignment>> {
    try {
      const existing = await this.teacherRepository.findOne({
        where: {
          user_id: data.user_id,
          subject_id: data.subject_id,
          class_id: data.class_id,
        },
      });

      if (existing) {
        return new ResponseDto({
          statusCode: 409,
          message: 'This teacher is already assigned to this subject.',
        });
      }

      const teacherAssignment = await this.teacherRepository.create({
        ...data,
      });

      return new ResponseDto({
        statusCode: 201,
        message: 'Teacher assignment created successfully',
        data: teacherAssignment,
      });
    } catch (error) {
      throw new ResponseDto({
        statusCode: 500,
        message: 'Error creating teacher assignment: ' + error.message,
      });
    }
  }

  async update(
    uuid: string,
    data: UpdateTeacherAssignmentDto,
  ): Promise<ResponseDto<TeacherAssignment>> {
    try {
      const teacherAssignment = await this.teacherRepository.findOne({
        where: { uuid },
      });
      if (!teacherAssignment) {
        return new ResponseDto({
          statusCode: 404,
          message: 'Teacher assignment not found',
        });
      }
      await teacherAssignment.update({ ...data });
      return new ResponseDto({
        statusCode: 200,
        message: 'Teacher assignment updated successfully',
        data: teacherAssignment,
      });
    } catch (error) {
      throw new ResponseDto({
        statusCode: 500,
        message: 'Error updating teacher assignment: ' + error.message,
      });
    }
  }

  async deleteTeacher(uuid: string): Promise<ResponseDto<TeacherAssignment>> {
    try {
      const teacherAssignment = await this.teacherRepository.findOne({
        where: { uuid },
      });
      if (!teacherAssignment) {
        return new ResponseDto({
          statusCode: 404,
          message: 'Teacher assignment not found',
        });
      }
      await teacherAssignment.destroy();
      return new ResponseDto({
        statusCode: 200,
        message: 'Teacher assignment deleted successfully',
      });
    } catch (error) {
      throw new ResponseDto({
        statusCode: 500,
        message: 'Error deleting teacher assignment: ' + error.message,
      });
    }
  }
}
