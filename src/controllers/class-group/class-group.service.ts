import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize';
import { CreateGroupDto, ResponseDto } from 'src/common/dto';
import { ClassGroup } from 'src/common/models';

@Injectable()
export class ClassGroupService {
  constructor(
    @Inject('CLASS_GROUP_REPOSITORY')
    private readonly classGroupRepository: typeof ClassGroup,
  ) {}

  async findAll(): Promise<ResponseDto<ClassGroup[]>> {
    try {
      const classGroups = await this.classGroupRepository.findAll();
      return new ResponseDto({
        statusCode: 200,
        message: 'Class groups fetched successfully',
        data: classGroups,
      });
    } catch (error) {
      throw new ResponseDto({
        statusCode: 500,
        message: 'Error fetching class groups: ' + error.message,
      });
    }
  }

  async create(data: CreateGroupDto): Promise<ResponseDto<ClassGroup>> {
    try {
      const classGroup = await this.classGroupRepository.create({ ...data });
      if (!classGroup) {
        return new ResponseDto({
          statusCode: 400,
          message: 'Failed to create class group',
        });
      }
      return new ResponseDto({
        statusCode: 201,
        message: 'Class group created successfully',
        data: classGroup,
      });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return new ResponseDto({
          statusCode: 400,
          message: 'Class group with this name already exists',
        });
      }
      throw new ResponseDto({
        statusCode: 500,
        message: 'Error creating class group: ' + error.message,
      });
    }
  }

  async delete(uuid: string): Promise<ResponseDto<ClassGroup>> {
    try {
      const classGroup = await this.classGroupRepository.findOne({
        where: { uuid },
      });
      if (!classGroup) {
        return new ResponseDto({
          statusCode: 404,
          message: 'Class group not found',
        });
      }
      await classGroup.destroy();
      return new ResponseDto({
        statusCode: 200,
        message: 'Class group deleted successfully',
      });
    } catch (error) {
      throw new ResponseDto({
        statusCode: 500,
        message: 'Error deleting class group: ' + error.message,
      });
    }
  }
}
