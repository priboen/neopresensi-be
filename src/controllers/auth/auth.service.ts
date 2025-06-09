import * as bcrypt from 'bcrypt';
import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO, RegisterDTO, ResponseDto } from 'src/common/dto';
import { User } from 'src/common/models';
import { Op } from 'sequelize';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY') private readonly userRepository: typeof User,
    private readonly jwtService: JwtService,
  ) {}

  private removePassword(user: User) {
    const { password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  async login(
    loginData: LoginDTO,
  ): Promise<ResponseDto<{ token: string; user: Partial<User> }>> {
    try {
      const user = await this.userRepository.findOne({
        where: { username: loginData.username },
      });
      if (!user) {
        return new ResponseDto({
          statusCode: 401,
          message: 'Incorrect username or password',
        });
      }
      const userData = user.toJSON();
      const isPasswordValid = await bcrypt.compare(
        loginData.password,
        userData.password,
      );
      if (!isPasswordValid) {
        return new ResponseDto({
          statusCode: 401,
          message: 'Incorrect username or password',
        });
      }
      const token = await this.jwtService.signAsync({
        uuid: userData.uuid,
        role: userData.role,
      });
      const userWithoutPassword = this.removePassword(user);
      return new ResponseDto({
        statusCode: 200,
        message: 'Login successful',
        data: {
          user: userWithoutPassword,
          token,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred during login: ' + error.message,
      );
    }
  }

  async register(registerData: RegisterDTO): Promise<ResponseDto<User>> {
    try {
      const hashedPassword = await bcrypt.hash(registerData.password, 10);
      const existingUser = await this.userRepository.findOne({
        where: {
          [Op.or]: [
            { username: registerData.username },
            { email: registerData.email },
          ],
        },
      });
      if (existingUser) {
        throw new HttpException(
          new ResponseDto({
            statusCode: 409,
            message: 'Username or email already exists',
          }),
          409,
        );
      }
      await this.userRepository.create({
        ...registerData,
        password: hashedPassword,
      });
      return new ResponseDto({
        statusCode: 201,
        message: 'Registration successful, please login',
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        new ResponseDto({
          statusCode: 500,
          message: 'An error occurred during registration: ' + error.message,
        }),
        500,
      );
    }
  }
}
