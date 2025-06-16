import { ApiProperty } from '@nestjs/swagger';
import { Subject } from 'src/common/models';

export class GetSubjectResponseDto {
  @ApiProperty({
    example: 200,
    description: 'HTTP status code',
  })
  statusCode: number;
  @ApiProperty({
    example: 'Subjects fetched successfully',
    description: 'Response message',
  })
  message: string;
  @ApiProperty({
    example: {
      uuid: '9ae92359-2500-4cb7-977b-db148db9ffda',
      name: 'Mathematics',
      createdAt: '2023-10-01T12:00:00Z',
      updatedAt: '2023-10-01T12:00:00Z',
    },
  })
  data: Subject[];
}
