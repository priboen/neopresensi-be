import { Inject, Injectable } from '@nestjs/common';
import { ResponseDto, UserUpdateDto } from 'src/common/dto';
import { User } from 'src/common/models';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';

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

  async getAllUsers(): Promise<ResponseDto<Partial<User>[]>> {
    try {
      const users = await this.userRepository.findAll({
        attributes: ['uuid', 'name', 'username', 'email', 'role', 'photo_url'],
      });

      return new ResponseDto<Partial<User>[]>({
        statusCode: 200,
        message: 'Users retrieved successfully',
        data: users,
      });
    } catch (error) {
      return new ResponseDto<Partial<User>[]>({
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
        if (fs.existsSync(photoPath) && fs.statSync(photoPath).isFile()) {
          fs.unlinkSync(photoPath);
        }
        await user.update({ photo_url: null });
        return new ResponseDto({
          statusCode: 200,
          message: 'Photo deleted successfully',
        });
      } catch (err) {
        return new ResponseDto({
          statusCode: 500,
          message: 'Failed to delete photo',
        });
      }
    } catch (err) {
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
      if (newPhotoUrl) {
        const oldUrl = user.getDataValue('photo_url');
        if (oldUrl && oldUrl !== newPhotoUrl) {
          try {
            const parsedUrl = new URL(oldUrl);
            const oldFilePath = path.join(
              process.cwd(),
              parsedUrl.pathname.replace(/^\/+/, ''),
            );
            if (fs.existsSync(oldFilePath)) {
              fs.unlinkSync(oldFilePath);
            }
          } catch (err) {
            throw new ResponseDto<UserUpdateDto>({
              statusCode: 500,
              message: 'Failed to delete old photo',
            });
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

  async updateUserByUuid(
    uuid: string,
    updateData: Partial<User>,
  ): Promise<ResponseDto<User>> {
    try {
      const user = await this.userRepository.findOne({ where: { uuid } });

      if (!user) {
        return new ResponseDto<User>({
          statusCode: 404,
          message: 'User not found',
        });
      }

      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }

      const updatedUser = await user.update(updateData);
      const { password, ...sanitizedUser } = updatedUser.toJSON();

      return new ResponseDto<User>({
        statusCode: 200,
        message: 'User updated successfully',
        data: sanitizedUser as User,
      });
    } catch (error) {
      return new ResponseDto<User>({
        statusCode: 500,
        message: 'An error occurred while updating the user',
      });
    }
  }

  async deleteProfile(uuid: string): Promise<ResponseDto<User>> {
    try {
      const user = await this.userRepository.findOne({
        where: { uuid },
        include: ['permissions'],
      });
      if (!user) {
        return new ResponseDto<User>({
          statusCode: 404,
          message: 'User not found',
        });
      }
      const photoUrl = user.getDataValue('photo_url');
      if (photoUrl) {
        const parsedPhotoUrl = new URL(photoUrl);
        const photoPath = path.join(
          process.cwd(),
          parsedPhotoUrl.pathname.replace(/^\/+/, ''),
        );
        if (fs.existsSync(photoPath) && fs.statSync(photoPath).isFile()) {
          fs.unlinkSync(photoPath);
          console.log(`🧹 Deleted user photo: ${photoPath}`);
        }
      }
      const permissions = user.getDataValue('permissions') || [];
      for (const perm of permissions) {
        const fileUrl = perm.getDataValue('file_url');
        if (fileUrl) {
          const parsedFileUrl = new URL(fileUrl);
          const filePath = path.join(
            process.cwd(),
            parsedFileUrl.pathname.replace(/^\/+/, ''),
          );
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            fs.unlinkSync(filePath);
            console.log(`🧹 Deleted permission file: ${filePath}`);
          }
        }
      }
      await user.destroy();
      return new ResponseDto<User>({
        statusCode: 200,
        message: 'User and related files successfully deleted',
      });
    } catch (error) {
      console.error('❌ Error in deleteProfile:', error);
      return new ResponseDto<User>({
        statusCode: 500,
        message:
          'An error occurred while deleting the user profile: ' + error.message,
      });
    }
  }
}
