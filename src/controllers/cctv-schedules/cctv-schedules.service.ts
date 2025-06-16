import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { ResponseDto } from 'src/common/dto';
import { CreateCctvScheduleDto } from 'src/common/dto/data/create-cctv-schedule.dto';
import { UpdateCctvScheduleDto } from 'src/common/dto/data/update-cctv-schedule.dto';
import { CCTVSchedule } from 'src/common/models';

@Injectable()
export class CctvSchedulesService {
  constructor(
    @Inject('CCTV_SCHEDULE_REPOSITORY')
    private readonly cctvScheduleRepository: typeof CCTVSchedule,
  ) {}

  async findAll(): Promise<ResponseDto<CCTVSchedule[]>> {
    try {
      const cctvSchedules = await this.cctvScheduleRepository.findAll();
      return new ResponseDto<CCTVSchedule[]>({
        statusCode: 200,
        message: 'CCTV schedules fetched successfully',
        data: cctvSchedules,
      });
    } catch (error) {
      throw new ResponseDto({
        statusCode: 500,
        message: 'Error fetching CCTV schedules: ' + error.message,
      });
    }
  }

  async create(
    data: CreateCctvScheduleDto,
  ): Promise<ResponseDto<CCTVSchedule>> {
    try {
      const existingSchedule = await this.cctvScheduleRepository.findOne({
        where: {
          day: data.day,
        },
      });
      if (existingSchedule) {
        return new ResponseDto({
          statusCode: 409,
          message: 'CCTV schedule for this day already exists',
        });
      }
      const cctvSchedule = await this.cctvScheduleRepository.create({
        ...data,
      });
      return new ResponseDto<CCTVSchedule>({
        statusCode: 201,
        message: 'CCTV schedule created successfully',
        data: cctvSchedule,
      });
    } catch (error) {
      return new ResponseDto({
        statusCode: 500,
        message: 'Error creating CCTV schedule: ' + error.message,
      });
    }
  }

  async update(
    uuid: string,
    data: Partial<UpdateCctvScheduleDto>,
  ): Promise<ResponseDto<UpdateCctvScheduleDto>> {
    try {
      const cctvSchedule = await this.cctvScheduleRepository.findOne({
        where: { uuid },
      });
      if (!cctvSchedule) {
        return new ResponseDto({
          statusCode: 404,
          message: 'CCTV schedule not found',
        });
      }
      const finalCctvId = data.cctv_id ?? cctvSchedule.getDataValue('cctv_id');
      const finalDay = data.day ?? cctvSchedule.getDataValue('day');
      const existingSchedule = await this.cctvScheduleRepository.findOne({
        where: {
          cctv_id: finalCctvId,
          day: finalDay,
          uuid: {
            [Op.ne]: uuid,
          },
        } as any,
      });
      if (existingSchedule) {
        return new ResponseDto({
          statusCode: 400,
          message: `Schedule for this CCTV on ${finalDay} already exists. Please pick another day.`,
        });
      }
      await cctvSchedule.update(data);
      return new ResponseDto({
        statusCode: 200,
        message: 'CCTV schedule updated successfully',
        data: cctvSchedule,
      });
    } catch (error) {
      return new ResponseDto({
        statusCode: 500,
        message: 'Error updating CCTV schedule: ' + error.message,
      });
    }
  }

  async delete(uuid: string): Promise<ResponseDto<CCTVSchedule>> {
    try {
      const cctvSchedule = await this.cctvScheduleRepository.findOne({
        where: { uuid },
      });
      if (!cctvSchedule) {
        return new ResponseDto({
          statusCode: 404,
          message: 'CCTV schedule not found',
        });
      }
      await cctvSchedule.destroy();
      return new ResponseDto<CCTVSchedule>({
        statusCode: 200,
        message: 'CCTV schedule deleted successfully',
        data: cctvSchedule,
      });
    } catch (error) {
      return new ResponseDto({
        statusCode: 500,
        message: 'Error deleting CCTV schedule: ' + error.message,
      });
    }
  }
}
