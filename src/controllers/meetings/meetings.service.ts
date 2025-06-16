import { Inject, Injectable } from '@nestjs/common';
import { CreateMeetingDto, ResponseDto, UpdateMeetingDto } from 'src/common/dto';
import { Meeting, MeetingAttendance, MeetingInvitation } from 'src/common/models';

@Injectable()
export class MeetingsService {
  constructor(
    @Inject('MEETING_REPOSITORY')
    private readonly meetingRepository: typeof Meeting,
  ) {}

  async findAll(): Promise<ResponseDto<any[]>> {
    try {
      const meetings = await this.meetingRepository.findAll({
        order: [
          ['date', 'ASC'],
          ['start_time', 'ASC'],
        ],
        include: [
          {
            model: MeetingInvitation,
            include: [
              {
                model: MeetingAttendance,
              },
            ],
          },
        ],
      });

      const result = meetings.map((meeting) => {
        const invitations = meeting.meetingInvitations || [];
        const totalInvited = invitations.length;
        let totalPresent = 0;

        invitations.forEach((inv) => {
          if (inv.meetingAttendances && inv.meetingAttendances.length > 0) {
            totalPresent++;
          }
        });

        return {
          uuid: meeting.getDataValue('uuid'),
          title: meeting.getDataValue('title'),
          description: meeting.getDataValue('description'),
          date: meeting.getDataValue('date'),
          start_time: meeting.getDataValue('start_time'),
          end_time: meeting.getDataValue('end_time'),
          total_invited: totalInvited,
          total_present: totalPresent,
          total_absent: totalInvited - totalPresent,
        };
      });

      return new ResponseDto({
        statusCode: 200,
        message: 'Meetings retrieved successfully',
        data: result,
      });
    } catch (error) {
      return new ResponseDto({
        statusCode: 500,
        message: 'Internal server error',
        data: error.message,
      });
    }
  }

  async create(data: CreateMeetingDto): Promise<ResponseDto<Meeting>> {
    try {
      const newMeeting = await this.meetingRepository.create({ ...data });
      return new ResponseDto<Meeting>({
        statusCode: 201,
        message: 'Meeting created successfully',
        data: newMeeting,
      });
    } catch (error) {
      return new ResponseDto({
        statusCode: 500,
        message: 'Internal server error',
        data: error.message,
      });
    }
  }

  async delete(uuid: string): Promise<ResponseDto<Meeting>> {
    try {
      const meeting = await this.meetingRepository.findOne({
        where: { uuid },
      });
      if (!meeting) {
        return new ResponseDto({
          statusCode: 404,
          message: 'Meeting not found',
        });
      }
      await meeting.destroy();
      return new ResponseDto<Meeting>({
        statusCode: 200,
        message: 'Meeting deleted successfully',
      });
    } catch (error) {
      return new ResponseDto({
        statusCode: 500,
        message: 'Internal server error',
        data: error.message,
      });
    }
  }

  async update(uuid: string, data: UpdateMeetingDto): Promise<ResponseDto<Meeting>> {
    try {
      const meeting = await this.meetingRepository.findOne({
        where: { uuid },
      });
      if (!meeting) {
        return new ResponseDto({
          statusCode: 404,
          message: 'Meeting not found',
        });
      }
      await meeting.update(data);
      return new ResponseDto<Meeting>({
        statusCode: 200,
        message: 'Meeting updated successfully',
        data: meeting,
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
