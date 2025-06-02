import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { FaceEmbeddingService } from './face-embedding.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';
import { CurrentUser, Roles } from 'src/common/decorators';
import { Role } from 'src/common/enums';
import { JwtPayload } from 'src/common/interfaces';
import {
  ForbiddenResponse,
  NotFoundResponse,
  UnauthorizedResponse,
  UpdateFaceEmbeddingDto,
} from 'src/common/dto';

@ApiTags('Face Embedding')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('face-embedding')
export class FaceEmbeddingController {
  constructor(private readonly faceEmbeddingService: FaceEmbeddingService) {}

  @Patch()
  @Roles(Role.Guru)
  @ApiOperation({
    summary: 'Update own face embedding',
    description:
      'Allows a user with the "Guru" role to update their own face embedding using the provided feature vector.',
  })
  @ApiResponse({
    status: 200,
    description: 'Face embedding successfully updated',
  })
  @ApiResponse({
    type: UnauthorizedResponse,
    status: 401,
    description: 'User must be authenticated',
  })
  @ApiResponse({
    type: NotFoundResponse,
    status: 404,
    description: 'User not found',
  })
  updateOwnFaceEmbedding(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateFaceEmbeddingDto,
  ) {
    return this.faceEmbeddingService.updateOwnFaceEmbedding(user.uuid, dto);
  }

  @Get()
  @Roles(Role.Guru)
  @ApiOperation({
    summary: 'Retrieve own face embedding',
    description:
      'Returns the current face embedding data for the authenticated "Guru" user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Face embedding successfully retrieved',
  })
  @ApiResponse({
    type: UnauthorizedResponse,
    status: 401,
    description: 'User must be authenticated',
  })
  getOwnFaceEmbedding(@CurrentUser() user: JwtPayload) {
    return this.faceEmbeddingService.getOwnFaceEmbedding(user.uuid);
  }

  @Delete(':identifier')
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Delete face embedding (Admin only)',
    description:
      'Allows admin to delete face embedding data for a user by using UUID, username, or email.',
  })
  @ApiParam({
    name: 'identifier',
    required: true,
    description: 'UUID, username, or email of the user',
    example: 'user123@email.com',
  })
  @ApiResponse({
    status: 200,
    description: 'Face embedding successfully deleted by admin',
  })
  @ApiResponse({
    type: UnauthorizedResponse,
    status: 401,
    description: 'User must be authenticated',
  })
  @ApiResponse({
    type: ForbiddenResponse,
    status: 403,
    description: 'Only accessible by admin',
  })
  @ApiResponse({
    type: NotFoundResponse,
    status: 404,
    description: 'User not found with the given identifier',
  })
  deleteUserFaceEmbedding(@Param('identifier') identifier: string) {
    return this.faceEmbeddingService.deleteFaceEmbeddingByIdentifier(
      identifier,
    );
  }
}
