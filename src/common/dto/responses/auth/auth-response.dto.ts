import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/common/models';

export class AuthSuccessResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Login successful' })
  message: string;

  @ApiProperty({
    example: {
      user: {
        uuid: '3efa959b-e73a-499b-b537-d7e1af6e4bfd',
        name: 'Muhamad Adri Muwaffaq Khamid',
        username: 'priboen',
        email: 'adri@mail.com',
        role: 'guru',
        face_embedding: null,
        photo_url: 'http://www.neopresensi.com/uploads/user/file-xxx.jpeg',
        createdAt: '2025-06-06T13:04:10.000Z',
        updatedAt: '2025-06-06T14:30:07.000Z',
      },
      token: 'eyJhbGciOiJIUzI1NiIsInR...',
    },
  })
  data: {
    user: Partial<User>;
    token: string;
  };
}

export class AuthInvalidResponseDto {
  @ApiProperty({ example: 401 })
  statusCode: number;

  @ApiProperty({ example: 'Incorrect username or password' })
  message: string;
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

  @ApiProperty({ example: 'Registration successful, please login' })
  message: string;
}

export class LoginValidationErrorResponseDto {
  @ApiProperty({
    example: [
      'username must be a string',
      'password should not be empty',
      'password must be a string',
    ],
  })
  message: string[];

  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty({ example: 400 })
  statusCode: number;
}


export class RegisterValidationErrorResponseDto {
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

  @ApiProperty({ example: 'Username or Email already exists' })
  message: string | object;
}
