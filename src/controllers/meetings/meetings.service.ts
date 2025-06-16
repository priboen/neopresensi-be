import { Inject, Injectable } from '@nestjs/common';
import {
  CreateMeetingDto,
  ResponseDto,
  UpdateMeetingDto,
} from 'src/common/dto';
import {
  Meeting,
  MeetingAttendance,
  MeetingInvitation,
} from 'src/common/models';
import * as dayjs from 'dayjs';

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
          include: [MeetingAttendance],
        },
      ],
    });
    const result = meetings.map((meeting) => {
      const {
        uuid,
        title,
        description,
        date,
        start_time,
        end_time,
        meetingInvitations = [],
      } = meeting.get({ plain: true });
      const totalInvited = meetingInvitations.length;
      const totalPresent = meetingInvitations.filter(
        (inv) => inv.meetingAttendances && inv.meetingAttendances.length > 0,
      ).length;
      const endTime = dayjs(`${date}T${end_time}`);
      const now = dayjs();
      const totalAbsent = endTime.isBefore(now)
        ? meetingInvitations.filter(
            (inv) => !inv.meetingAttendances || inv.meetingAttendances.length === 0,
          ).length
        : 0;

      return {
        uuid,
        title,
        description,
        date,
        start_time,
        end_time,
        total_invited: totalInvited,
        total_present: totalPresent,
        total_absent: totalAbsent,
      };
    });

    return new ResponseDto({
      statusCode: 200,
      message: 'Meetings retrieved successfully',
      data: result,
    });
  } catch (error) {
    console.error('Meeting error:', error);
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

  async update(
    uuid: string,
    data: UpdateMeetingDto,
  ): Promise<ResponseDto<Meeting>> {
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
