import { ApiProperty } from '@nestjs/swagger';

export class CreateClassGroupResponse {
  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: 'Class group created successfully' })
  message: string;

  @ApiProperty({
    example: {
      uuid: '7d77838d-cfdb-4618-9c51-a413067fa01c',
      name: 'C',
      createdAt: '2025-06-14T16:31:23.000Z',
      updatedAt: '2025-06-14T16:31:23.000Z',
    },
  })
  data: {
    uuid: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
}

export class ClassGroupAlreadyExistsResponse {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Class group with this name already exists' })
  message: string;
}

export class GetAllClassGroupsResponse {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Class groups fetched successfully' })
  message: string;

  @ApiProperty({
    example: [
      {
        uuid: '4a29b691-3598-4676-b0e4-f303378307f2',
        name: 'A',
        createdAt: '2025-06-14T16:31:13.000Z',
        updatedAt: '2025-06-14T16:31:13.000Z',
      },
      {
        uuid: '7d77838d-cfdb-4618-9c51-a413067fa01c',
        name: 'C',
        createdAt: '2025-06-14T16:31:23.000Z',
        updatedAt: '2025-06-14T16:31:23.000Z',
      },
      {
        uuid: 'aecaaa35-9f31-4781-931a-0d1b81cae321',
        name: 'B',
        createdAt: '2025-06-14T16:31:19.000Z',
        updatedAt: '2025-06-14T16:31:19.000Z',
      },
    ],
  })
  data: {
    uuid: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

export class DeleteClassGroupResponse {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Class group deleted successfully' })
  message: string;
}

export class ClassGroupNotFoundResponse {
  @ApiProperty({ example: 404 })
  statusCode: number;

  @ApiProperty({ example: 'Class group not found' })
  message: string;
}

export class ValidationErrorResponse {
  @ApiProperty({
    example: ['name should not be empty', 'name must be a string'],
    description: 'Array of validation error messages',
  })
  message: string[];

  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty({ example: 400 })
  statusCode: number;
}
