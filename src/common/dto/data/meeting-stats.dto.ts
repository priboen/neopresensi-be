import { ApiProperty } from "@nestjs/swagger";

export class MeetingStatsDto {
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "The unique identifier for the meeting",
  })
  uuid: string;
  @ApiProperty({
    example: "Team Sync",
    description: "The title of the meeting",
  })
  title: string;
  @ApiProperty({
    example: "2025-01-01",
    description: "The date of the meeting in YYYY-MM-DD format",
  })
  date: string;
  @ApiProperty({
    example: "10:00",
    description: "The start time of the meeting in HH:mm format",
  })
  start_time: string;
  @ApiProperty({
    example: "11:00",
    description: "The end time of the meeting in HH:mm format",
  })
  end_time: string;
  @ApiProperty({
    example: 10,
    description: "Total number of participants invited to the meeting",
  })
  total_invited: number;
  @ApiProperty({
    example: 8,
    description: "Total number of participants who attended the meeting",
  })
  total_present: number;
  @ApiProperty({
    example: 2,
    description: "Total number of participants who were absent from the meeting",
  })
  total_absent: number;
}
