import { ApiProperty } from '@nestjs/swagger';

// User Summary DTO
class UserSummary {
  @ApiProperty({ example: 'Affan Nabil Ramadham' })
  name: string;
}

// Subject Summary DTO
class SubjectSummary {
  @ApiProperty({ example: 'IPA' })
  name: string;
}

// ClassGroup Summary DTO
class ClassGroupSummary {
  @ApiProperty({ example: 'A' })
  name: string;
}

// Classes Summary DTO
class ClassesSummary {
  @ApiProperty({ example: 7 })
  grade: number;

  @ApiProperty({ type: ClassGroupSummary })
  group: ClassGroupSummary;
}

// TeacherAssignment Data DTO
class TeacherAssignmentData {
  @ApiProperty({ example: '758e06b5-b29b-4ee2-a0c6-dc98fb002f94' })
  uuid: string;

  @ApiProperty({ example: '3fa01691-e56c-423f-8478-bcc3efa71a7e' })
  user_id: string;

  @ApiProperty({ example: '40bf7de8-8eb0-47dc-9a4c-f52cdb839201' })
  class_id: string;

  @ApiProperty({ example: 'a45033b8-197d-435c-8591-77efa08ff7ce' })
  subject_id: string;

  @ApiProperty({ example: '2025-06-18T12:26:09.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-06-18T12:26:09.000Z' })
  updatedAt: Date;

  @ApiProperty({ type: SubjectSummary })
  subject: SubjectSummary;

  @ApiProperty({ type: ClassesSummary })
  classes: ClassesSummary;

  @ApiProperty({ type: UserSummary })
  user: UserSummary;
}

// Schedule Data DTO
class ScheduleData {
  @ApiProperty({ example: '6825edc7-2bfc-49dd-a3b2-e0d721f9a3b1' })
  uuid: string;

  @ApiProperty({ example: 'Monday' })
  day: string;

  @ApiProperty({ example: '07:40' })
  start_time: string;

  @ApiProperty({ example: '08:30' })
  end_time: string;

  @ApiProperty({ example: '758e06b5-b29b-4ee2-a0c6-dc98fb002f94' })
  teacher_id: string;

  @ApiProperty({ example: '2025-06-18T12:40:07.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-06-18T12:40:07.000Z' })
  updatedAt: Date;

  @ApiProperty({ type: TeacherAssignmentData })
  teacherAssignment: TeacherAssignmentData;
}

// Get Schedules Response DTO
export class GetSchedulesResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Schedules fetched successfully' })
  message: string;

  @ApiProperty({ type: [ScheduleData] })
  data: ScheduleData[];
}
