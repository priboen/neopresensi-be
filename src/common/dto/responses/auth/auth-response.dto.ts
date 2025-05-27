import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/common/models';

export class AuthSuccessResponseDto {
  @ApiProperty({ description: 'HTTP status code for successful login', example: 201 })
  @ApiProperty({ example: 200 })
  statusCode: number;
  @ApiProperty({ example: 'Login successful' })
  message: string;
  @ApiProperty({
    example: {
      token: 'eyJhbGciOiJIUzI1NiIsInR...'
    }
  })
  data: string;
}

export class AuthInvalidResponseDto {
  @ApiProperty({ example: 400 })
  statusCode: number;
  @ApiProperty({ example: 'Invalid username or password' })
  message: string | object;
}

export class NotFoundResponseDto {
  @ApiProperty({ example: 'Invalid username or password' })
  message: string | object;

  @ApiProperty({ example: 204 })
  statusCode: number;
}

export class RegisterSuccessResponseDto {
  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: 'Registered successfully, please login' })
  message: string;

  @ApiProperty({
    example: {
      id: 1,
      isAdmin: false,
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@mail.com',
      createdAt: '2025-05-01T12:00:00Z',
      updatedAt: '2025-05-01T12:00:00Z',
    },
  })
  data: User;
}

export class ValidationErrorResponseDto {
  @ApiProperty({
    example: [
      'Name should be at least 1 characters long',
      'name should not be empty',
      'Username should be at least 2 characters long',
      'username should not be empty',
      'email should not be empty',
      'email must be an email',
      'Password must contain at least one uppercase letter, one number, and one special character',
      'Password should be at least 6 characters long',
      'password should not be empty',
    ],
    description: 'Array of validation error messages',
  })
  message: string[];

  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty({ example: 400 })
  statusCode: number;
}

export class DuplicateResponseDto {
  @ApiProperty({ example: 409 })
  statusCode: number;

  @ApiProperty({ example: 'Username or Email already registered' })
  message: string | object;
}
