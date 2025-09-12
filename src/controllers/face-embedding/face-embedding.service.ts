import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { UpdateFaceEmbeddingDto, ResponseDto } from 'src/common/dto';
import { User } from 'src/common/models';

@Injectable()
export class FaceEmbeddingService {
  constructor(
    @Inject('USER_REPOSITORY') private readonly userRepository: typeof User,
  ) {}

  private removePassword(user: User) {
    const { password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  async updateOwnFaceEmbedding(
    uuid: string,
    dto: UpdateFaceEmbeddingDto,
  ): Promise<ResponseDto<User>> {
    try {
      // if (!Array.isArray(dto.face_embedding)) {
      //   return new ResponseDto({
      //     statusCode: 400,
      //     message: 'face_embedding must be an array of numbers',
      //   });
      // }
      const user = await this.userRepository.findOne({
        where: { uuid },
        raw: false,
      });
      if (!user) {
        return new ResponseDto({
          statusCode: 404,
          message: 'User not found',
        });
      }
      const plainUser = user.get({ plain: true });
      console.log('Updating face embedding for user:', plainUser.username);
      const updatedUser = await user.update({
        face_embedding: JSON.stringify(dto.face_embedding),
      });

      return new ResponseDto({
        statusCode: 200,
        message: 'Face embedding successfully updated',
        data: this.removePassword(updatedUser),
      });
    } catch (error) {
      return new ResponseDto({
        statusCode: 500,
        message: 'An error while updating face embedding: ' + error.message,
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

  async getAllFaceEmbeddings(): Promise<
    ResponseDto<Pick<User, 'uuid' | 'name' | 'face_embedding'>[]>
  > {
    try {
      const users = await this.userRepository.findAll({
        attributes: ['uuid', 'name', 'face_embedding'],
        where: {
          face_embedding: {
            [Op.ne]: null,
          },
        },
      });

      if (users.length === 0) {
        return new ResponseDto({
          statusCode: 404,
          message: 'No face embeddings found',
          data: [],
        });
      }

      return new ResponseDto({
        statusCode: 200,
        message: 'All face embeddings retrieved successfully',
        data: users, // sudah hanya berisi uuid, name, face_embedding
      });
    } catch (error) {
      return new ResponseDto({
        statusCode: 500,
        message:
          'An error while retrieving all face embeddings: ' + error.message,
      });
    }
  }
}
