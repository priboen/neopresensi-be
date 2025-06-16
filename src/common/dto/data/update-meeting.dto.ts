import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsOptional, IsString } from "class-validator";
import { Is } from "sequelize-typescript";

export class UpdateMeetingDto {
  @ApiProperty({
    example: "Team Sync",
    description: "The title of the meeting",
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: "Discuss project updates and next steps",
    description: "A brief description of the meeting",
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: "2023-10-01",
    description: "The date of the meeting",
    required: false,
  })
  @IsOptional()
  @IsDate()
  date?: Date;

  @ApiProperty({
    example: "10:00",
    description: "The start time of the meeting in HH:mm format",
    required: false,
  })
  @IsOptional()
  @IsString()
  start_time?: string;

  @ApiProperty({
    example: "11:00",
    description: "The end time of the meeting in HH:mm format",
    required: false,
  })
  @IsOptional()
  @IsString()
  end_time?: string;
}