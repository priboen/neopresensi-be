import { Inject, Injectable } from '@nestjs/common';
import { ResponseDto, UserUpdateDto } from 'src/common/dto';
import { User } from 'src/common/models';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY') private readonly userRepository: typeof User,
  ) {}

  async uploadUserAvatar(file: Express.Multer.File): Promise<string> {
    const destFolder = path.join(process.cwd(), 'uploads/user');
    if (!fs.existsSync(destFolder)) {
      fs.mkdirSync(destFolder, { recursive: true });
    }
    const newPath = path.join(destFolder, path.basename(file.path));
    fs.renameSync(file.path, newPath);
    return `uploads/user/${path.basename(file.path)}`;
  }

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

  async deleteProfilePhoto(uuid: string): Promise<ResponseDto<null>> {
    try {
      const user = await this.userRepository.findOne({
        where: { uuid },
        attributes: ['uuid', 'photo_url'],
        raw: false,
      });
      console.log(
        '🔍 Searching for user with UUID:',
        user?.getDataValue('uuid'),
      );

      console.log('👤 User found:', user?.uuid);
      console.log('🖼️ Current photo URL:', user?.photo_url);

      if (!user?.get || !user.getDataValue('photo_url')) {
        return new ResponseDto({
          statusCode: 404,
          message: 'User not found or no photo to delete',
        });
      }

      try {
        const parsedUrl = new URL(user.getDataValue('photo_url'));
        const photoPath = path.resolve(
          process.cwd(),
          parsedUrl.pathname.replace(/^\/+/, ''),
        );

        console.log('🧹 File to delete:', photoPath);

        if (fs.existsSync(photoPath) && fs.statSync(photoPath).isFile()) {
          fs.unlinkSync(photoPath);
          console.log(`✅ Deleted photo: ${photoPath}`);
        }

        await user.update({ photo_url: null });

        return new ResponseDto({
          statusCode: 200,
          message: 'Photo deleted successfully',
        });
      } catch (err) {
        console.error('❌ Failed deleting photo:', err.message);
        return new ResponseDto({
          statusCode: 500,
          message: 'Failed to delete photo',
        });
      }
    } catch (err) {
      console.error('❌ Unexpected error:', err);
      return new ResponseDto({
        statusCode: 500,
        message: 'Unexpected error occurred',
      });
    }
  }

  async updateProfile(
    uuid: string,
    updateData: Partial<UserUpdateDto>,
    newPhotoUrl?: string,
  ): Promise<ResponseDto<UserUpdateDto>> {
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
      // if (newPhotoUrl) {
      //   // Optional: hapus file lama jika berbeda
      //   if (user.photo_url && user.photo_url !== newPhotoUrl) {
      //     const oldPath = path.join(
      //       process.cwd(),
      //       user.photo_url.replace(/^.*uploads/, 'uploads'),
      //     );
      //     if (fs.existsSync(oldPath)) {
      //       fs.unlinkSync(oldPath);
      //     }
      //   }
      //   updateData.photo_url = newPhotoUrl;
      // }

      if (newPhotoUrl) {
        const oldUrl = user.photo_url;

        if (oldUrl && oldUrl !== newPhotoUrl) {
          try {
            const parsedUrl = new URL(oldUrl);
            const oldFilePath = path.join(
              process.cwd(),
              parsedUrl.pathname.replace(/^\/+/, ''),
            );

            if (fs.existsSync(oldFilePath)) {
              fs.unlinkSync(oldFilePath);
              console.log(`🧹 Old photo deleted: ${oldFilePath}`);
            }
          } catch (err) {
            console.error('❌ Failed to parse old photo URL:', err.message);
          }
        }

        updateData.photo_url = newPhotoUrl;
      }

      const updatedUser = await user.update(updateData);
      return new ResponseDto<UserUpdateDto>({
        statusCode: 200,
        message: 'User profile updated successfully',
        data: this.removePassword(updatedUser!),
      });
    } catch (error) {
      return new ResponseDto<UserUpdateDto>({
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
