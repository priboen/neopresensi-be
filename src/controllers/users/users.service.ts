import { Inject, Injectable, Res } from '@nestjs/common';
import { ResponseDto } from 'src/common/dto';
import { User } from 'src/common/models';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY') private readonly userRepository: typeof User,
  ) {}

  private removePassword(user: User) {
    const { password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  async getAllUsers(): Promise<ResponseDto<User[]>> {
    try {
      const users = await this.userRepository.findAll({
        attributes: { exclude: ['password'] },
      });
      return new ResponseDto<User[]>({
        statusCode: 200,
        message: 'Users retrieved successfully',
        data: users.map((user) => this.removePassword(user) as User),
      });
    } catch (error) {
      return new ResponseDto<User[]>({
        statusCode: 500,
        message: 'An error occurred while retrieving users',
      });
    }
  }

  async getProfile(uuid: string): Promise<ResponseDto<User>> {
    try {
      const user = await this.userRepository.findOne({
        where: { uuid },
        attributes: { exclude: ['password'] },
      });
      if (!user) {
        throw new ResponseDto<User>({
          statusCode: 404,
          message: 'User not found',
        });
      }
      return new ResponseDto<User>({
        statusCode: 200,
        message: 'User profile retrieved successfully',
        data: this.removePassword(user) as User,
      });
    } catch (error) {
      return new ResponseDto<User>({
        statusCode: 500,
        message: 'An error occurred while retrieving the user profile',
      });
    }
  }

  async findUserBySmartIdentifier(
    identifier: string,
  ): Promise<ResponseDto<User>> {
    try {
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          identifier,
        );
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
      const whereClause = isUuid
        ? { uuid: identifier }
        : isEmail
          ? { email: identifier }
          : { username: identifier };
      const user = await this.userRepository.findOne({
        where: whereClause,
        attributes: { exclude: ['password'] },
      });
      if (!user) {
        return new ResponseDto<User>({
          statusCode: 404,
          message: 'User not found',
        });
      }
      return new ResponseDto<User>({
        statusCode: 200,
        message: 'User retrieved successfully',
        data: this.removePassword(user) as User,
      });
    } catch (error) {
      return new ResponseDto<User>({
        statusCode: 500,
        message: 'An error occurred while retrieving the user',
      });
    }
  }

  async updateProfile(
    uuid: string,
    updateData: Partial<User>,
  ): Promise<ResponseDto<User>> {
    try {
      const user = await this.userRepository.findOne({
        where: { uuid },
        attributes: { exclude: ['password'] },
      });
      if (!user) {
        throw new ResponseDto<User>({
          statusCode: 404,
          message: 'User not found',
        });
      }
      const updatedUser = await user.update(updateData);
      return new ResponseDto<User>({
        statusCode: 200,
        message: 'User profile updated successfully',
        data: this.removePassword(updatedUser) as User,
      });
    } catch (error) {
      return new ResponseDto<User>({
        statusCode: 500,
        message: 'An error occurred while updating the user profile',
      });
    }
  }

  async updateUserByIdentifier(
    identifier: string,
    updateData: Partial<User>,
  ): Promise<ResponseDto<User>> {
    try {
      const isUuid = /^[0-9a-f-]{36}$/.test(identifier);
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
      const whereClause = isUuid
        ? { uuid: identifier }
        : isEmail
          ? { email: identifier }
          : { username: identifier };
      const user = await this.userRepository.findOne({ where: whereClause });
      if (!user) {
        return new ResponseDto<User>({
          statusCode: 404,
          message: 'User not found',
        });
      }
      const updated = await user.update(updateData);
      return new ResponseDto<User>({
        statusCode: 200,
        message: 'User updated successfully',
        data: this.removePassword(updated) as User,
      });
    } catch (error) {
      return new ResponseDto<User>({
        statusCode: 500,
        message: 'An error occurred while updating the user',
      });
    }
  }

  async deleteProfile(identifier: string): Promise<ResponseDto<void>> {
    try {
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          identifier,
        );
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
      const whereClause = isUuid
        ? { uuid: identifier }
        : isEmail
          ? { email: identifier }
          : { username: identifier };
      const user = await this.userRepository.findOne({
        where: whereClause,
      });
      if (!user) {
        return new ResponseDto<void>({
          statusCode: 404,
          message: 'User not found',
        });
      }
      await user.destroy();
      return new ResponseDto<void>({
        statusCode: 200,
        message: 'User profile deleted successfully',
      });
    } catch (error) {
      return new ResponseDto<void>({
        statusCode: 500,
        message: 'An error occurred while deleting the user profile',
      });
    }
  }
}
