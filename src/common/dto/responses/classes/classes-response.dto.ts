import { ApiProperty } from '@nestjs/swagger';

export class CreateClassResponse {
  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: 'Class created successfully' })
  message: string;

  @ApiProperty({
    example: {
      uuid: 'db3cdb25-57d6-46e7-9969-23aa3ba85077',
      grade: 9,
      group_id: '4a29b691-3598-4676-b0e4-f303378307f2',
      createdAt: '2025-06-14T17:50:03.517Z',
      updatedAt: '2025-06-14T17:50:03.517Z',
    },
  })
  data: {
    uuid: string;
    grade: number;
    group_id: string;
    createdAt: string;
    updatedAt: string;
  };
}

export class ClassAlreadyExistsResponse {
  @ApiProperty({ example: 409 })
  statusCode: number;

  @ApiProperty({ example: 'Class with this grade and group already exists' })
  message: string;
}

export class GetAllClassesResponse {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Classes fetched successfully' })
  message: string;

  @ApiProperty({
    example: [
      {
        uuid: '9ae92359-2500-4cb7-977b-db148db9ffda',
        gradeGroup: '7 A',
      },
      {
        uuid: 'e5542dfc-d144-41c5-9c32-bf284e1983a1',
        gradeGroup: '7 B',
      },
      {
        uuid: '2a818cd2-fd8d-4a10-8570-bea9733f9893',
        gradeGroup: '7 C',
      },
    ],
  })
  data: {
    uuid: string;
    gradeGroup: string;
  }[];
}

export class DeleteClassResponse {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Class deleted successfully' })
  message: string;
}

export class ClassNotFoundResponse {
  @ApiProperty({ example: 404 })
  statusCode: number;

  @ApiProperty({ example: 'Class not found' })
  message: string;
}

export class ClassesValidationErrorResponse {
  @ApiProperty({
    example: ['grade must be a number', 'group_id should not be empty'],
    description: 'Array of validation error messages',
  })
  message: string[];

  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty({ example: 400 })
  statusCode: number;
}
