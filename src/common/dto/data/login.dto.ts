import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginDTO {
  @ApiProperty({
    example: 'priboen', description: 'Username for login'
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: 'P@ssword123!', description: 'User password'
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}