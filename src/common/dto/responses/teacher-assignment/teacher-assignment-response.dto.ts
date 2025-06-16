import { ApiProperty } from '@nestjs/swagger';

class UserSummary {
  @ApiProperty({ example: 'Affan Nabil Ramadham' })
  name: string;

  @ApiProperty({ example: 'https://example.com/photo.jpg', nullable: true })
  photo_url: string | null;
}

class SubjectSummary {
  @ApiProperty({ example: 'Physics' })
  name: string;
}

class TeacherAssignmentData {
  @ApiProperty({ example: '3fb2ca77-f153-4e80-9974-93193db51cc3' })
  uuid: string;

  @ApiProperty({ example: '3fa01691-e56c-423f-8478-bcc3efa71a7e' })
  user_id: string;

  @ApiProperty({ example: 'ea37b24b-64b2-4805-96ee-c7da6a61eb61' })
  class_id: string;

  @ApiProperty({ example: '5d32680f-c3c2-4631-b60e-0c66c4c7d54c' })
  subject_id: string;

  @ApiProperty({ example: '2025-06-16T18:08:15.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-06-16T18:08:15.000Z' })
  updatedAt: Date;

  @ApiProperty({ type: UserSummary })
  user: UserSummary;

  @ApiProperty({ type: SubjectSummary })
  subject: SubjectSummary;
}

export class GetTeacherAssignmentsResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Teacher assignments fetched successfully' })
  message: string;

  @ApiProperty({ type: [TeacherAssignmentData] })
  data: TeacherAssignmentData[];
}

export class CreateTeacherAssignmentResponseDto {
  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: 'Teacher assignment created successfully' })
  message: string;

  @ApiProperty({
    example: {
      uuid: '3fb2ca77-f153-4e80-9974-93193db51cc3',
      user_id: '3fa01691-e56c-423f-8478-bcc3efa71a7e',
      class_id: 'ea37b24b-64b2-4805-96ee-c7da6a61eb61',
      subject_id: '5d32680f-c3c2-4631-b60e-0c66c4c7d54c',
      createdAt: '2025-06-16T18:08:15.000Z',
      updatedAt: '2025-06-16T18:08:15.000Z',
    },
  })
  data: any;
}

export class UpdateTeacherAssignmentResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Teacher assignment updated successfully' })
  message: string;

  @ApiProperty({
    example: {
      uuid: '11c5eed2-3014-4c25-a84a-ae4c61573261',
      user_id: '3fa01691-e56c-423f-8478-bcc3efa71a7e',
      class_id: 'ea37b24b-64b2-4805-96ee-c7da6a61eb61',
      subject_id: 'ca165508-793e-4631-8b44-bf254d96af49',
      createdAt: '2025-06-16T18:04:04.000Z',
      updatedAt: '2025-06-16T18:05:30.424Z',
    },
  })
  data: any;
}

export class DeleteTeacherAssignmentResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Teacher assignment deleted successfully' })
  message: string;

  @ApiProperty({ nullable: true, example: undefined })
  data?: any;
}
