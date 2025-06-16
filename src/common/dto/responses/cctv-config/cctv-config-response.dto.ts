import { ApiProperty } from '@nestjs/swagger';

export class CreateConfigResponseDto {
  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: 'CCTV configuration created successfully' })
  message: string;

  @ApiProperty({
    example: {
      uuid: '7d77838d-cfdb-4618-9c51-a413067fa01c',
      name: "Teacher's Room CCTV",
      rtsp_url: 'rtsp://example.com/stream',
      username: 'admin',
      password: 'password123',
      createdAt: '2025-06-14T16:31:23.000Z',
      updatedAt: '2025-06-14T16:31:23.000Z',
    },
  })
  data: {
    uuid: string;
    name: string;
    rtsp_url: string;
    username?: string;
    password?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export class GetAllConfigsResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'CCTV configurations fetched successfully' })
  message: string;

  @ApiProperty({
    example: [
      {
        uuid: '4a29b691-3598-4676-b0e4-f303378307f2',
        name: "Teacher's Room CCTV",
        rtsp_url: 'rtsp://example.com/stream',
        username: 'admin',
        password: 'password123',
        createdAt: '2025-06-14T16:31:13.000Z',
        updatedAt: '2025-06-14T16:31:13.000Z',
      },
      // More CCTV configurations...
    ],
  })
  data: Array<{
    uuid: string;
    name: string;
    rtsp_url: string;
    username?: string;
    password?: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

export class UpdateConfigResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'CCTV configuration updated successfully' })
  message: string;

  @ApiProperty({
    example: {
      uuid: '7d77838d-cfdb-4618-9c51-a413067fa01c',
      name: "Teacher's Room CCTV",
      rtsp_url: 'rtsp://example.com/stream',
      username: 'admin',
      password: 'password123',
      createdAt: '2025-06-14T16:31:23.000Z',
      updatedAt: '2025-06-14T16:31:23.000Z',
    },
  })
  data: {
    uuid: string;
    name: string;
    rtsp_url: string;
    username?: string;
    password?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export class ConfigNotFoundResponseDto {
  @ApiProperty({ example: 404 })
  statusCode: number;

  @ApiProperty({ example: 'CCTV configuration not found' })
  message: string;
}

export class DeleteConfigResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'CCTV configuration deleted successfully' })
  message: string;
}

export class ConfigValidationErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request' })
  errors: string;

  @ApiProperty({
    example: {
      name: 'Name is required',
      rtsp_url: 'RTSP URL must start with rtsp://',
    },
  })
  message: Record<string, string>;
}