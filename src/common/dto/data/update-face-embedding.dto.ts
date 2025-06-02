import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateFaceEmbeddingDto {
  @ApiProperty({
    example: '0.512,0.243,-0.125,...',
    description: 'Face embedding data as a comma-separated string or vector',
  })
  @IsString()
  @IsNotEmpty()
  face_embedding: string;
}
