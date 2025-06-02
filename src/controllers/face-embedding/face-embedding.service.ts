import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { UpdateFaceEmbeddingDto, ResponseDto } from 'src/common/dto';
import { User } from 'src/common/models';

@Injectable()
export class FaceEmbeddingService {
  constructor(
    @Inject('USER_REPOSITORY') private readonly userRepository: typeof User,
  ) {}

  async updateOwnFaceEmbedding(
    uuid: string,
    dto: UpdateFaceEmbeddingDto,
  ): Promise<ResponseDto<User>> {
    try {
      const user = await this.userRepository.findOne({ where: { uuid } });
      if (!user) {
        return new ResponseDto({
          statusCode: 404,
          message: 'User not found',
        });
      }

      user.face_embedding = dto.face_embedding;
      await user.save();

      return new ResponseDto({
        statusCode: 200,
        message: 'Face embedding successfully updated',
        data: user,
      });
    } catch (error) {
      return new ResponseDto({
        statusCode: 500,
        message: 'Failed to update face embedding: ' + error.message,
      });
    }
  }

  async getOwnFaceEmbedding(uuid: string): Promise<ResponseDto<User>> {
    try {
      const user = await this.userRepository.findOne({ where: { uuid } });
      if (!user) {
        return new ResponseDto({
          statusCode: 404,
          message: 'User not found',
        });
      }

      return new ResponseDto({
        statusCode: 200,
        message: 'Face embedding retrieved successfully',
        data: user,
      });
    } catch (error) {
      return new ResponseDto({
        statusCode: 500,
        message: 'An error while retrieved face embedding: ' + error.message,
      });
    }
  }

  async deleteFaceEmbeddingByIdentifier(
    identifier: string,
  ): Promise<ResponseDto<User>> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          [Op.or]: [
            { uuid: identifier },
            { username: identifier },
            { email: identifier },
          ],
        },
      });

      if (!user) {
        return new ResponseDto({
          statusCode: 404,
          message: 'User not found',
        });
      }

      user.face_embedding = null;
      await user.save();

      return new ResponseDto({
        statusCode: 200,
        message: 'Face embedding successfully deleted',
        data: user,
      });
    } catch (error) {
      return new ResponseDto({
        statusCode: 500,
        message: 'An error while deleting face embedding: ' + error.message,
      });
    }
  }
}
