import { Inject, Injectable } from '@nestjs/common';
import { ResponseDto } from 'src/common/dto';
import { AdminAttendanceCreateDto } from 'src/common/dto/data/admin-attendance-create.dto';
import { AttendanceCreateDto } from 'src/common/dto/data/attendance-create.dto';
import { UserAttendanceDto } from 'src/common/dto/data/user-attendance.dto';
import { Attendance, CCTVSchedule, User } from 'src/common/models';
import moment from 'src/helpers/moment.helper';

@Injectable()
export class AttendanceService {
  constructor(
    @Inject('ATTENDANCE_REPOSITORY')
    private readonly attendanceRepository: typeof Attendance,
    @Inject('CCTV_SCHEDULE_REPOSITORY')
    private readonly cctvScheduleRepository: typeof CCTVSchedule,
  ) {}

  async createAttendance(
    attendanceDto: AttendanceCreateDto,
  ): Promise<ResponseDto<Attendance>> {
    try {
      const timeNow = moment(attendanceDto.time, 'HH:mm:ss');

      const includeUserOption = {
        model: User,
        attributes: ['name', 'photo_url'],
      };

      const schedule = await this.cctvScheduleRepository.findByPk(
        attendanceDto.cctvScheduleId,
      );
      if (!schedule) {
        return new ResponseDto({
          statusCode: 404,
          message: 'Jadwal CCTV tidak ditemukan.',
        });
      }

      const checkInTime = moment(
        schedule.getDataValue('check_in_time'),
        'HH:mm:ss',
      );
      const checkOutTime = moment(
        schedule.getDataValue('check_out_time'),
        'HH:mm:ss',
      );
      const checkInDeadline = checkInTime.clone().add(1, 'hour');

      const existingAttendance = await this.attendanceRepository.findOne({
        where: {
          user_id: attendanceDto.uuid,
          cctv_schedule_id: attendanceDto.cctvScheduleId,
          date: moment().format('YYYY-MM-DD'),
        },
      });
      await existingAttendance?.reload({
        include: [includeUserOption],
      });
      if (!existingAttendance) {
        if (timeNow.isAfter(checkOutTime)) {
          return new ResponseDto({
            statusCode: 400,
            message: `Waktu presensi sudah berakhir pada ${checkOutTime.format('HH:mm')}. Anda tidak dapat melakukan check-in.`,
          });
        }
        if (timeNow.isBefore(checkInTime)) {
          return new ResponseDto({
            statusCode: 400,
            message: `Presensi belum dibuka. Silakan hadir setelah jam ${checkInTime.format('HH:mm')}`,
          });
        }
        const status = timeNow.isAfter(checkInDeadline)
          ? 'terlambat'
          : 'tepat waktu';

        const newAttendance = await this.attendanceRepository.create({
          user_id: attendanceDto.uuid,
          cctv_schedule_id: attendanceDto.cctvScheduleId,
          date: moment().format('YYYY-MM-DD'),
          check_in: timeNow.format('HH:mm:ss'),
          status,
        });

        await newAttendance.reload({
          include: [includeUserOption],
        });

        return new ResponseDto({
          statusCode: 201,
          message: `Presensi masuk berhasil${status === 'terlambat' ? ' (terlambat)' : ''}`,
          data: newAttendance,
        });
      }
      if (existingAttendance.getDataValue('check_out')) {
        await existingAttendance.reload({
          include: [includeUserOption],
        });
        return new ResponseDto({
          statusCode: 400,
          message: 'Anda sudah melakukan presensi pulang.',
          data: existingAttendance,
        });
      }
      if (timeNow.isBefore(checkOutTime)) {
        return new ResponseDto({
          statusCode: 400,
          message:
            'Belum waktunya presensi pulang. Silakan coba saat jam pulang.',
        });
      }
      existingAttendance.check_out = timeNow.format('HH:mm:ss');
      // await existingAttendance.save();

      await existingAttendance.update(
        { check_out: existingAttendance.check_out },
        { where: { uuid: existingAttendance.uuid } },
      );

      await existingAttendance.reload({ include: [includeUserOption] });

      return new ResponseDto({
        statusCode: 200,
        message: 'Presensi pulang berhasil.',
        data: existingAttendance,
      });
    } catch (error) {
      throw new ResponseDto({
        statusCode: 500,
        message: 'Gagal membuat presensi: ' + error.message,
      });
    }
  }

  async createAttendanceForAdmin(
    attendanceDto: AdminAttendanceCreateDto,
  ): Promise<ResponseDto<Attendance>> {
    try {
      const schedule = await this.cctvScheduleRepository.findByPk(
        attendanceDto.cctvScheduleId,
      );
      if (!schedule) {
        return new ResponseDto({
          statusCode: 404,
          message: 'Jadwal CCTV tidak ditemukan.',
        });
      }

      const checkInTime = moment(
        schedule.getDataValue('check_in_time'),
        'HH:mm:ss',
      );
      const checkOutTime = moment(
        schedule.getDataValue('check_out_time'),
        'HH:mm:ss',
      );

      const existingAttendance = await this.attendanceRepository.findOne({
        where: {
          user_id: attendanceDto.uuid,
          date: attendanceDto.date,
        },
      });

      if (existingAttendance) {
        return new ResponseDto({
          statusCode: 400,
          message: 'Presensi untuk tanggal ini sudah ada.',
        });
      }

      const newAttendance = await this.attendanceRepository.create({
        user_id: attendanceDto.uuid,
        cctv_schedule_id: attendanceDto.cctvScheduleId,
        date: attendanceDto.date,
        status: attendanceDto.status,
        check_in: attendanceDto.check_in,
        check_out: attendanceDto.check_out,
      });

      await newAttendance.reload({
        include: [
          {
            model: User,
            attributes: ['name', 'photo_url'],
          },
          {
            model: CCTVSchedule,
            attributes: ['day', 'check_in_time', 'check_out_time'],
          },
        ],
      });

      return new ResponseDto({
        statusCode: 201,
        message: 'Presensi berhasil dibuat untuk admin.',
        data: newAttendance,
      });
    } catch (error) {
      throw new ResponseDto({
        statusCode: 500,
        message: 'Gagal membuat presensi untuk admin: ' + error.message,
      });
    }
  }

  async getAllAttendances(): Promise<ResponseDto<Attendance[]>> {
    try {
      const attendances = await this.attendanceRepository.findAll({
        include: [
          {
            model: User,
            attributes: ['name', 'photo_url'],
          },
          {
            model: CCTVSchedule,
            attributes: ['day', 'check_in_time', 'check_out_time'],
          },
        ],
      });

      return new ResponseDto({
        statusCode: 200,
        message: 'Daftar presensi berhasil diambil.',
        data: attendances,
      });
    } catch (error) {
      throw new ResponseDto({
        statusCode: 500,
        message: 'Gagal mengambil daftar presensi: ' + error.message,
      });
    }
  }

  async getAttendanceByDate(date: string): Promise<ResponseDto<Attendance[]>> {
    try {
      const attendances = await this.attendanceRepository.findAll({
        where: { date: date },
        include: [
          {
            model: User,
            attributes: ['name', 'photo_url'],
          },
          {
            model: CCTVSchedule,
            attributes: ['day', 'check_in_time', 'check_out_time'],
          },
        ],
      });

      if (attendances.length === 0) {
        return new ResponseDto({
          statusCode: 404,
          message: 'Tidak ada presensi ditemukan untuk tanggal ini.',
        });
      }

      return new ResponseDto({
        statusCode: 200,
        message: 'Presensi berhasil diambil.',
        data: attendances,
      });
    } catch (error) {
      throw new ResponseDto({
        statusCode: 500,
        message: 'Gagal mengambil presensi: ' + error.message,
      });
    }
  }

  async getUserAttendanceByDate(
    userId: string,
    date: string,
  ): Promise<ResponseDto<Attendance[]>> {
    console.log('Tipe data userId:', typeof userId, '| Nilai:', userId);
    console.log('Tipe data date:', typeof date, '| Nilai:', `'${date}'`);
    console.log('Fetching attendance for user:', userId, 'on date:', date);
    try {
      const attendances = await this.attendanceRepository.findAll({
        where: { user_id: userId, date: date },
      });

      if (attendances.length === 0) {
        return new ResponseDto({
          statusCode: 404,
          message: 'Tidak ada presensi ditemukan untuk tanggal ini.',
        });
      }

      return new ResponseDto({
        statusCode: 200,
        message: 'Presensi berhasil diambil.',
        data: attendances,
      });
    } catch (error) {
      throw new ResponseDto({
        statusCode: 500,
        message: 'Gagal mengambil presensi pengguna: ' + error.message,
      });
    }
  }
}
