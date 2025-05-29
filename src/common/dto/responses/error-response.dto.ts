import { ApiProperty } from '@nestjs/swagger';

class BaseErrorResponse {
  @ApiProperty({ example: 401, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ example: 'Unauthorized', description: 'Error message' })
  message: string;
}

export class UnauthorizedResponse extends BaseErrorResponse {
  @ApiProperty({ example: 'Unauthorized' })
  declare message: string;

  @ApiProperty({ example: 401 })
  declare statusCode: number;
}

export class BadRequestResponse extends BaseErrorResponse {
  @ApiProperty({ example: 'Bad Request' })
  declare message: string;

  @ApiProperty({ example: 400 })
  declare statusCode: number;
}

export class ForbiddenResponse extends BaseErrorResponse {
  @ApiProperty({ example: 'Forbidden Resource' })
  declare message: string;

  @ApiProperty({example : 'Forbidden'})
  declare error: string;

  @ApiProperty({ example: 403 })
  declare statusCode: number;
}

export class NotFoundResponse extends BaseErrorResponse {
  @ApiProperty({ example: 'Not Found' })
  declare message: string;

  @ApiProperty({ example: 404 })
  declare statusCode: number;
}

export class InternalServerErrorResponse extends BaseErrorResponse {
  @ApiProperty({ example: 'Internal server error' })
  declare message: string;

  @ApiProperty({ example: 500 })
  declare statusCode: number;
}
