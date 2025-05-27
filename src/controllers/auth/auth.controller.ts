import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDTO } from 'src/common/dto/data/login.dto';
import { AuthInvalidResponseDto, AuthSuccessResponseDto, DuplicateResponseDto, NotFoundResponseDto, RegisterSuccessResponseDto, ValidationErrorResponseDto } from 'src/common/dto/responses/auth/auth-response.dto';
import { RegisterDTO } from 'src/common/dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Login', description: 'User  send a request to the server for log in into Mobile Apps or Website' })
  @ApiResponse({ type: AuthSuccessResponseDto, status: 200, description: 'Login successful' })
  @ApiResponse({ type: NotFoundResponseDto, status: 204, description: 'Invalid username or password' })
  @ApiResponse({ type: AuthInvalidResponseDto, status: 400, description: 'Invalid username or password' })
  async loginAndroid(@Body() signInData: LoginDTO): Promise<AuthSuccessResponseDto | NotFoundResponseDto | AuthInvalidResponseDto> {
    return this.authService.login(signInData);
  }

  @Post('/register')
  @ApiOperation({ summary: 'Register', description: 'User send a request to the server for sign up into Mobile Apps' })
  @ApiResponse({ type: RegisterSuccessResponseDto, status: 201, description: 'Registered successfully, please login' })
  @ApiResponse({ type: ValidationErrorResponseDto, status: 400, description: 'Bad Request' })
  @ApiResponse({ type: DuplicateResponseDto, status: 409, description: 'Username or Email already registered' })
  @ApiBody({ type: RegisterDTO })
  async signUp(@Body() registerData: RegisterDTO) {
    return this.authService.register(registerData);
  }
}
