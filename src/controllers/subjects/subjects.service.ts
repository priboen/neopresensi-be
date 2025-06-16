import { Inject, Injectable } from '@nestjs/common';
import { CreateSubjectDto, ResponseDto } from 'src/common/dto';
import { Subject } from 'src/common/models';

@Injectable()
export class SubjectsService {
  constructor(
    @Inject('SUBJECT_REPOSITORY')
    private readonly subjectsRepository: typeof Subject,
  ) {}

  async findAll(): Promise<ResponseDto<Subject[]>> {
    try {
      const subjects = await this.subjectsRepository.findAll();
      return new ResponseDto({
        statusCode: 200,
        message: 'Subjects retrieved successfully',
        data: subjects,
      });
    } catch (error) {
      throw new ResponseDto({
        statusCode: 500,
        message: 'Failed to retrieve subjects',
      });
    }
  }

  async create(data: CreateSubjectDto): Promise<ResponseDto<Subject>> {
    try {
      const subject = await this.subjectsRepository.create({ ...data });
      if (!subject) {
        return new ResponseDto({
          statusCode: 400,
          message: 'Failed to create subject',
        });
      }
      return new ResponseDto({
        statusCode: 201,
        message: 'Subject created successfully',
        data: subject,
      });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return new ResponseDto({
          statusCode: 400,
          message: 'Subject with this name already exists',
        });
      }
      throw new ResponseDto({
        statusCode: 500,
        message: 'Failed to create subject: ' + error.message,
      });
    }
  }

  async deleteSubject(uuid: string): Promise<ResponseDto<Subject>> {
    try {
      const subject = await this.subjectsRepository.findOne({
        where: { uuid },
      });
      if (!subject) {
        return new ResponseDto({
          statusCode: 404,
          message: 'Subject not found',
        });
      }
      await subject.destroy();
      return new ResponseDto({
        statusCode: 200,
        message: 'Subject deleted successfully',
        data: subject,
      });
    } catch (error) {
      throw new ResponseDto({
        statusCode: 500,
        message: 'Failed to delete subject: ' + error.message,
      });
    }
  }
}
