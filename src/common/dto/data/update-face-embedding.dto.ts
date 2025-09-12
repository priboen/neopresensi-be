import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class UpdateFaceEmbeddingDto {
  @ApiProperty({
    example: [0.512, 0.243, -0.125 /* … */],
    description: 'Face embedding data sebagai array of numbers',
    type: [Number],
  })
  @IsNotEmpty()
  face_embedding: number[];
}
