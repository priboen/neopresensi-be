import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AdminUpdateDto,
  DeleteUserResponse,
  ForbiddenResponse,
  GetAllUserResponse,
  GetUserByIdResponse,
  GetUserProfileResponse,
  NotFoundResponse,
  UnauthorizedResponse,
  UpdateUserResponse,
  UserUpdateDto,
} from 'src/common/dto';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';
import { CurrentUser, Roles } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { Role } from 'src/common/enums';

@ApiTags('User')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Mendapatkan semua data user',
    description:
      'This endpoint is accessible only by users with the `admin` role.',
  })
  @ApiResponse({
    type: GetAllUserResponse,
    status: 200,
    description: 'List of users retrieved successfully',
  })
  @ApiResponse({
    type: UnauthorizedResponse,
    status: 401,
    description: 'Unauthorized: User must be authenticated',
  })
  @Get()
  @Roles(Role.Admin)
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({
    summary: 'Get user profile',
    description: 'Retrieve the profile of the authenticated user',
  })
  @ApiResponse({
    type: GetUserProfileResponse,
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({
    type: UnauthorizedResponse,
    status: 401,
    description: 'Unauthorized: User must be authenticated',
  })
  @ApiResponse({
    type: ForbiddenResponse,
    status: 403,
    description: 'Forbidden: Only accessible by admin role',
  })
  @Get('profile')
  getProfile(@CurrentUser() user: JwtPayload) {
    return this.usersService.getProfile(user.uuid);
  }

  @ApiOperation({
    summary: 'Get user by identifier',
    description:
      '🔐 Requires admin role. Retrieve user by UUID, username, or email.',
  })
  @ApiResponse({
    type: GetUserByIdResponse,
    status: 200,
    description: 'User retrieved successfully',
  })
  @ApiResponse({
    type: UnauthorizedResponse,
    status: 401,
    description: 'Unauthorized: User must be authenticated',
  })
  @ApiResponse({
    type: ForbiddenResponse,
    status: 403,
    description: 'Forbidden: Only accessible by admin role',
  })
  @Get(':identifier')
  @Roles(Role.Admin)
  getUserByIdentifier(@Param('identifier') identifier: string) {
    return this.usersService.findUserBySmartIdentifier(identifier);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update own profile' })
  @ApiResponse({
    type: UpdateUserResponse,
    status: 200,
    description: 'Profile updated',
  })
  @ApiResponse({
    type: UnauthorizedResponse,
    status: 401,
    description: 'Unauthorized: User must be authenticated',
  })
  updateOwnProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UserUpdateDto,
  ) {
    return this.usersService.updateProfile(user.uuid, dto);
  }

  @Patch(':identifier')
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Update user by identifier',
    description: '🔐 Requires admin role.',
  })
  @ApiResponse({
    type: UpdateUserResponse,
    status: 200,
    description: 'User updated successfully',
  })
  @ApiResponse({
    type: UnauthorizedResponse,
    status: 401,
    description: 'Unauthorized: User must be authenticated',
  })
  @ApiResponse({
    type: ForbiddenResponse,
    status: 403,
    description: 'Forbidden: Only accessible by admin role',
  })
  updateUserByIdentifier(
    @Param('identifier') identifier: string,
    @Body() dto: AdminUpdateDto,
  ) {
    return this.usersService.updateUserByIdentifier(identifier, dto);
  }

  @Delete(':identifier')
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Delete user',
    description:
      '🔐 Requires admin role. You can delete user by UUID, Email or username',
  })
  @ApiResponse({
    type: DeleteUserResponse,
    status: 200,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    type: UnauthorizedResponse,
    status: 401,
    description: 'Unauthorized: User must be authenticated',
  })
  @ApiResponse({
    type: ForbiddenResponse,
    status: 403,
    description: 'Forbidden: Admin only',
  })
  @ApiResponse({
    type: NotFoundResponse,
    status: 404,
    description:
      'User not found: The user with the specified identifier does not exist.',
  })
  deleteUser(@Param('identifier') identifier: string) {
    return this.usersService.deleteProfile(identifier);
  }
}
