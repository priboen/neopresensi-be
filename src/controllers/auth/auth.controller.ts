import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  AuthInvalidResponseDto,
  AuthSuccessResponseDto,
  DuplicateResponseDto,
  LoginDTO,
  NotFoundResponseDto,
  RegisterDTO,
  RegisterSuccessResponseDto,
  LoginValidationErrorResponseDto,
  RegisterValidationErrorResponseDto,
} from 'src/common/dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({
    summary: 'Login',
    description:
      'Endpoint untuk masuk ke dalam aplikasi menggunakan username dan password yang valid.',
  })
  @ApiResponse({
    type: AuthSuccessResponseDto,
    status: 200,
    description: 'Login berhasil. Token dikembalikan.',
  })
  @ApiResponse({
    type: NotFoundResponseDto,
    status: 204,
    description: 'Data pengguna tidak ditemukan.',
  })
  @ApiResponse({
    type: AuthInvalidResponseDto,
    status: 401,
    description: 'Username atau password tidak valid.',
  })
  @ApiResponse({
    type: LoginValidationErrorResponseDto,
    status: 400,
    description: 'Validasi data gagal. Periksa format dan keunikan data.',
  })
  async login(
    @Body() signInData: LoginDTO,
  ): Promise<
    AuthSuccessResponseDto | NotFoundResponseDto | AuthInvalidResponseDto
  > {
    return this.authService.login(signInData);
  }

  @Post('/register')
  @ApiOperation({
    summary: 'Register Pengguna',
    description:
      'Endpoint untuk membuat akun baru di aplikasi dengan data yang valid. Email dan username harus unik.',
  })
  @ApiResponse({
    type: RegisterSuccessResponseDto,
    status: 201,
    description: 'Register berhasil.',
  })
  @ApiResponse({
    type: RegisterValidationErrorResponseDto,
    status: 400,
    description: 'Validasi data gagal. Periksa format dan keunikan data.',
  })
  @ApiResponse({
    type: DuplicateResponseDto,
    status: 409,
    description: 'Nama pengguna atau email sudah digunakan.',
  })
  @ApiBody({ type: RegisterDTO })
  async signUp(@Body() registerData: RegisterDTO) {
    return this.authService.register(registerData);
  }
}
