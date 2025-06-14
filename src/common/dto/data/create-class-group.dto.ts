import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({
    example: 'A',
    description: 'The name of the group class',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
