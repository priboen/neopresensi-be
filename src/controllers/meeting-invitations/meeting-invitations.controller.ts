import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MeetingInvitationsService } from './meeting-invitations.service';
import { CreateMeetingInvitationDto } from 'src/common/dto';
import { CurrentUser, Roles } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';
import { Role } from 'src/common/enums';
import { ApiOperation } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('meeting-invitations')
export class MeetingInvitationsController {
  constructor(
    private readonly meetingInvitationsService: MeetingInvitationsService,
  ) {}

  @Get()
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Retrieve all meeting invitations',
    description:
      'This endpoint retrieves all meeting invitations from the database.',
  })
  async findAll() {
    return this.meetingInvitationsService.findAll();
  }

  @Get('user')
  @ApiOperation({
    summary: 'Retrieve meeting invitations by user UUID',
    description:
      'This endpoint retrieves meeting invitations for a specific user.',
  })
  async findByUserUuid(@CurrentUser() user: JwtPayload) {
    return this.meetingInvitationsService.findByUserUuid(user.uuid);
  }

  @Get('meeting/:meetingUuid')
  @ApiOperation({
    summary: 'Retrieve meeting invitations by meeting UUID',
    description:
      'This endpoint retrieves meeting invitations for a specific meeting.',
  })
  async findByMeetingUuid(@Param('meetingUuid') meetingUuid: string) {
    return this.meetingInvitationsService.findByMeetingUuid(meetingUuid);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new meeting invitation',
    description: 'This endpoint allows an admin to create a new meeting invitation.',
  })
  @Roles(Role.Admin)
  async createMeetingInvitation(
    @Body()
    createMeetingInvitationDto: CreateMeetingInvitationDto,
  ) {
    return this.meetingInvitationsService.create(createMeetingInvitationDto);
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'Delete a meeting invitation by UUID',
    description: 'This endpoint allows an admin to delete a meeting invitation.',
  })
  @Roles(Role.Admin)
  async deleteMeetingInvitation(@Param('uuid') uuid: string) {
    return this.meetingInvitationsService.deleteInvitation(uuid);
  }
}
