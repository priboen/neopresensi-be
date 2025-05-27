import * as bcrypt from 'bcrypt';
import { Inject, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO, RegisterDTO, ResponseDto } from 'src/common/dto';
import { User } from 'src/common/models';
import { Op } from 'sequelize';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY') private readonly userRepository: typeof User,
    private readonly jwtService: JwtService,
  ){}

  private removePassword(user: User) {
    const { password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  // private async validateLogin(loginData: LoginDTO, requiredRole: 'admin' | 'guru'): Promise<ResponseDto<{ token: string }>> {
  //   try {
  //     const user = await this.userRepository.findOne({
  //       where: { username: loginData.username },
  //     });
  //     if (!user) {
  //       return new ResponseDto<{ token: string }>({
  //         statusCode: 401,
  //         message: 'Invalid username or password',
  //       });
  //     }
  //     const userData = user.toJSON();
  //     const isPasswordValid = await bcrypt.compare(
  //       loginData.password,
  //       userData.password,
  //     );
  //     if (!isPasswordValid) {
  //       return new ResponseDto<{ token: string }>({
  //         statusCode: 401,
  //         message: 'Invalid username or password',
  //       });
  //     }
  //     if (userData.role !== requiredRole) {
  //       const errorMessage = requiredRole === 'admin'
  //         ? 'Web login is restricted to admin users'
  //         : 'Android login is restricted to teacher role';
  //       throw new UnauthorizedException(errorMessage);
  //     }
  //     const token = await this.jwtService.signAsync({ uuid: userData.uuid, role: userData.role });
  //     return new ResponseDto<{ token: string }>({
  //       statusCode: 200,
  //       message: 'Login successful',
  //       data: { token },
  //     });
  //   } catch (error) {
  //     if (error instanceof UnauthorizedException) {
  //       return new ResponseDto<{ token: string }>({
  //         statusCode: 401,
  //         message: error.message,
  //       });
  //     }
  //     throw new InternalServerErrorException('An error occurred during login', error.message);
  //   }
  // }

  // async loginWeb(loginData: LoginDTO): Promise<ResponseDto<{ token: string }>> {
  //   return this.validateLogin(loginData, 'admin');
  // }

  // async loginAndroid(loginData: LoginDTO): Promise<ResponseDto<{ token: string }>> {
  //   return this.validateLogin(loginData, 'guru');
  // }

  async login(loginData: LoginDTO): Promise<ResponseDto<{ token: string }>> {
    try {
      const user = await this.userRepository.findOne({
        where: { username: loginData.username },
      });
      if (!user) {
        return new ResponseDto<{ token: string }>({
          statusCode: 401,
          message: 'Invalid username or password',
        });
      }
      const userData = user.toJSON();
      const isPasswordValid = await bcrypt.compare(
        loginData.password,
        userData.password,
      );
      if (!isPasswordValid) {
        return new ResponseDto<{ token: string }>({
          statusCode: 401,
          message: 'Invalid username or password',
        });
      }
      const token = await this.jwtService.signAsync({ uuid: userData.uuid, role: userData.role });
      return new ResponseDto<{ token: string }>({
        statusCode: 200,
        message: 'Login successful',
        data: { token },
      });
    } catch (error) {
      throw new InternalServerErrorException('An error occurred during login', error.message);
    }
  }

  async register(registerData: RegisterDTO): Promise<ResponseDto<User>> {
    try {
      const hashedPassword = await bcrypt.hash(registerData.password, 10);
      const existingUser = await this.userRepository.findOne({
        where: {
          [Op.or]: [
            { username: registerData.username }, 
            { email: registerData.email }],
        },
      })
      if (existingUser) {
        return new ResponseDto<User>({
          statusCode: 409,
          message: 'Username or Email already registered',
        });
      }
      const user = await this.userRepository.create({
        ...registerData,
        password: hashedPassword,
      });
      const newUser = this.removePassword(user);
      return new ResponseDto<User>({
        statusCode: 201,
        message: 'Registered successfully, please login',
        data: newUser,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message, error);
    }
  }
}
