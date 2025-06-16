import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, Matches } from 'class-validator';

export class CreateCctvConfigsDto {
  @ApiProperty({
    example: "Teacher's Room CCTV",
    description: 'The name of the CCTV configuration',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'rtsp://example.com/stream',
    description: 'The RTSP URL for the CCTV stream',
    required: true,
  })
  @Matches(/^rtsp:\/\/.+/, {
    message: 'rtsp_url must be a valid RTSP URL starting with rtsp://',
  })
  rtsp_url: string;

  @ApiProperty({
    example: 'admin',
    description: 'The username for the CCTV stream authentication',
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password for the CCTV stream authentication',
    required: false,
  })
  @IsOptional()
  @IsString()
  password?: string;
}
