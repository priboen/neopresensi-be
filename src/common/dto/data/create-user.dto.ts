import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({
    example: 'Muhamad Adri Muwaffaq Khamid',
    description: 'Full name of the user',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Name should be at least 1 characters long' })
  name: string;

  @ApiProperty({
    example: 'priboen',
    description: 'Username for login',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Username should be at least 2 characters long' })
  @MaxLength(25, { message: 'Username should not exceed 25 characters' })
  username: string;

  @ApiProperty({
    example: 'adri@mail.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'P@ssword123!',
    description: 'User password',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password should be at least 6 characters long' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/, {
    message:
      'Password must contain at least one uppercase letter, one number, and one special character',
  })
  password: string;

  @ApiProperty({
    example: 'teacher',
    description: 'Role of the user',
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['admin', 'teacher'], {
    message: 'Role must be either admin, or teacher',
  })
  role: string;
}
