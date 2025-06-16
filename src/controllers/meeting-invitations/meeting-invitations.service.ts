import { Inject, Injectable } from '@nestjs/common';
import { ResponseDto } from 'src/common/dto';
import { MeetingInvitation, Meeting, User } from 'src/common/models';
import { CreateMeetingInvitationDto } from 'src/common/dto/data/create-meeting-invitation.dto';

@Injectable()
export class MeetingInvitationsService {
  constructor(
    @Inject('MEETING_INVITATION_REPOSITORY')
    private readonly meetingInvitationRepository: typeof MeetingInvitation,
  ) {}

  async findAll(): Promise<ResponseDto<MeetingInvitation[]>> {
    try {
      const invitations = await this.meetingInvitationRepository.findAll({
        include: [
          {
            model: Meeting,
            attributes: ['title', 'date', 'start_time', 'end_time'],
          },
          {
            model: User,
            attributes: ['uuid', 'name', 'photo_url'],
          },
        ],
      });
      return new ResponseDto({
        statusCode: 200,
        message: 'Meeting invitations retrieved successfully',
        data: invitations,
      });
    } catch (error) {
      return new ResponseDto({
        statusCode: 500,
        message: 'Internal server error',
        data: error.message,
      });
    }
  }

  async findByUserUuid(
    user_id: string,
  ): Promise<ResponseDto<MeetingInvitation[]>> {
    try {
      const invitations = await this.meetingInvitationRepository.findAll({
        where: { user_id },
        include: [
          {
            model: Meeting,
            attributes: ['title', 'date', 'start_time', 'end_time'],
          },
          {
            model: User,
            attributes: ['uuid', 'name', 'photo_url'],
          },
        ],
      });
      if (!invitations) {
        return new ResponseDto({
          statusCode: 404,
          message: 'No meeting invitations found for this user',
        });
      }
      return new ResponseDto({
        statusCode: 200,
        message: 'Meeting invitations retrieved successfully',
        data: invitations,
      });
    } catch (error) {
      console.error(error);
      return new ResponseDto({
        statusCode: 500,
        message: 'Internal server error',
        data: error.message,
      });
    }
  }

  async findByMeetingUuid(
    meetingUuid: string,
  ): Promise<ResponseDto<MeetingInvitation[]>> {
    try {
      const invitations = await this.meetingInvitationRepository.findAll({
        where: { meeting_id: meetingUuid },
        include: {
          model: User,
          attributes: ['uuid', 'name', 'photo_url'],
        }
      });
      return new ResponseDto({
        statusCode: 200,
        message: 'Meeting invitations retrieved successfully',
        data: invitations,
      });
    } catch (error) {
      return new ResponseDto({
        statusCode: 500,
        message: 'Internal server error',
      });
    }
  }

  async create(
    data: CreateMeetingInvitationDto,
  ): Promise<ResponseDto<MeetingInvitation>> {
    try {
      const existing = await this.meetingInvitationRepository.findOne({
        where: {
          meeting_id: data.meeting_id,
          user_id: data.user_id,
        },
      });

      if (existing) {
        return new ResponseDto({
          statusCode: 409,
          message: 'User is already invited to this meeting',
        });
      }

      const newInvitation = await this.meetingInvitationRepository.create({
        ...data,
      });
      return new ResponseDto({
        statusCode: 201,
        message: 'Meeting invitation created successfully',
        data: newInvitation,
      });
    } catch (error) {
      return new ResponseDto({
        statusCode: 500,
        message: 'Internal server error',
        data: error.message,
      });
    }
  }

  async deleteInvitation(
    uuid: string,
  ): Promise<ResponseDto<MeetingInvitation>> {
    try {
      const invitation = await this.meetingInvitationRepository.findOne({
        where: { uuid },
      });
      if (!invitation) {
        return new ResponseDto({
          statusCode: 404,
          message: 'Meeting invitation not found',
        });
      }
      await invitation.destroy();
      return new ResponseDto({
        statusCode: 200,
        message: 'Meeting invitation deleted successfully',
      });
    } catch (error) {
      return new ResponseDto({
        statusCode: 500,
        message: 'Internal server error',
        data: error.message,
      });
    }
  }
}
