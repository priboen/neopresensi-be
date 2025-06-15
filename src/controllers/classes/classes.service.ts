import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { ResponseDto } from 'src/common/dto';
import { CreateClassesDto } from 'src/common/dto/data/create-classes.dto';
import { Classes, ClassGroup } from 'src/common/models';

@Injectable()
export class ClassesService {
  constructor(
    @Inject('CLASS_REPOSITORY')
    private readonly classesRepository: typeof Classes,
  ) {}

  async create(data: CreateClassesDto): Promise<ResponseDto<Classes>> {
    try {
      const existingClass = await this.classesRepository.findOne({
        where: {
          grade: data.grade,
          group_id: data.group_id,
        },
      });
      if (existingClass) {
        throw new ConflictException(
          'Class with this grade and group already exists',
        );
      }
      const newClass = await this.classesRepository.create({ ...data });
      return new ResponseDto<Classes>({
        statusCode: 201,
        message: 'Class created successfully',
        data: newClass,
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        return new ResponseDto({
          statusCode: 409,
          message: error.message,
        });
      }
      return new ResponseDto({
        statusCode: 500,
        message: 'Internal server error',
        data: error.message,
      });
    }
  }

  async findAll(): Promise<
    ResponseDto<{ uuid: string; gradeGroup: string }[]>
  > {
    try {
      const classes = await this.classesRepository.findAll({
        include: [
          {
            model: ClassGroup,
            as: 'group',
            attributes: ['name'],
          },
        ],
        order: [
          ['grade', 'ASC'],
          ['group', 'name', 'ASC'],
        ],
      });
      const formattedClasses = classes.map((classItem) => ({
        uuid: classItem.getDataValue('uuid'),
        gradeGroup: `${classItem.getDataValue('grade')} ${classItem.getDataValue('group')?.getDataValue('name') || 'N/A'}`,
      }));
      return new ResponseDto<{ uuid: string; gradeGroup: string }[]>({
        statusCode: 200,
        message: 'Classes fetched successfully',
        data: formattedClasses,
      });
    } catch (error) {
      return new ResponseDto({
        statusCode: 500,
        message: 'Error fetching classes: ' + error.message,
      });
    }
  }

  async delete(uuid: string): Promise<ResponseDto<Classes>> {
    try {
      const classToDelete = await this.classesRepository.findOne({
        where: { uuid },
      });
      if (!classToDelete) {
        return new ResponseDto({
          statusCode: 404,
          message: 'Class not found',
        });
      }
      await classToDelete.destroy();
      return new ResponseDto<Classes>({
        statusCode: 200,
        message: 'Class deleted successfully',
      });
    } catch (error) {
      return new ResponseDto({
        statusCode: 500,
        message: 'Error deleting class: ' + error.message,
      });
    }
  }
}
