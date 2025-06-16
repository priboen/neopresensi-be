import { Inject, Injectable, Res } from '@nestjs/common';
import { ResponseDto } from 'src/common/dto';
import { CreateCctvConfigsDto } from 'src/common/dto/data/create-cctv-configs.dto';
import { UpdateCctvConfigDto } from 'src/common/dto/data/update-cctv-config.dto';
import { CCTVConfig } from 'src/common/models';

@Injectable()
export class CctvConfigsService {
  constructor(
    @Inject('CCTV_CONFIG_REPOSITORY')
    private readonly cctvConfigsRepository: typeof CCTVConfig,
  ) {}

  async findAll(): Promise<ResponseDto<CCTVConfig[]>> {
    try {
      const cctvConfigs = await this.cctvConfigsRepository.findAll();
      return new ResponseDto<CCTVConfig[]>({
        statusCode: 200,
        message: 'CCTV configurations fetched successfully',
        data: cctvConfigs,
      });
    } catch (error) {
      throw new ResponseDto({
        statusCode: 500,
        message: 'Error fetching CCTV configurations: ' + error.message,
      });
    }
  }

  async create(data: CreateCctvConfigsDto): Promise<ResponseDto<CCTVConfig>> {
    try {
      const cctv = await this.cctvConfigsRepository.create({ ...data });
      return new ResponseDto<CCTVConfig>({
        statusCode: 201,
        message: 'CCTV configuration created successfully',
        data: cctv,
      });
    } catch (error) {
      return new ResponseDto({
        statusCode: 500,
        message: 'Error creating CCTV configuration: ' + error.message,
      });
    }
  }

  async update(
    uuid: string,
    data: Partial<UpdateCctvConfigDto>,
  ): Promise<ResponseDto<CCTVConfig>> {
    try {
      const cctv = await this.cctvConfigsRepository.findOne({
        where: { uuid },
      });
      if (!cctv) {
        return new ResponseDto({
          statusCode: 404,
          message: 'CCTV configuration not found',
        });
      }
      await cctv.update(data);
      return new ResponseDto<CCTVConfig>({
        statusCode: 200,
        message: 'CCTV configuration updated successfully',
        data: cctv,
      });
    } catch (error) {
      return new ResponseDto({
        statusCode: 500,
        message: 'Error updating CCTV configuration: ' + error.message,
      });
    }
  }

  async delete(uuid: string): Promise<ResponseDto<CCTVConfig>> {
    try {
      const cctv = await this.cctvConfigsRepository.findOne({
        where: { uuid },
      });
      if (!cctv) {
        return new ResponseDto({
          statusCode: 404,
          message: 'CCTV configuration not found',
        });
      }
      await cctv.destroy();
      return new ResponseDto<CCTVConfig>({
        statusCode: 200,
        message: 'CCTV configuration deleted successfully',
        data: cctv,
      });
    } catch (error) {
      return new ResponseDto({
        statusCode: 500,
        message: 'Error deleting CCTV configuration: ' + error.message,
      });
    }
  }
}
