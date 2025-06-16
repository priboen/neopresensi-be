import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCctvConfigDto {
  @ApiProperty({
    example: "Teacher's Room CCTV",
    description: 'The name of the CCTV configuration',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? undefined : value))
  name?: string;

  @ApiProperty({
    example: 'rtsp://example.com/stream',
    description: 'The RTSP URL for the CCTV stream',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? undefined : value))
  rtsp_url?: string;

  @ApiProperty({
    example: 'admin',
    description: 'The username for the CCTV stream authentication',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? undefined : value))
  username?: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password for the CCTV stream authentication',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? undefined : value))
  password?: string;
}
