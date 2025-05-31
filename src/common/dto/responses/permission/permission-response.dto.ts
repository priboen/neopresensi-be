import { ApiProperty } from '@nestjs/swagger';
import { Permission } from 'src/common/models';

export class CreatePermissionResponse {
  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: 'Permission created successfully' })
  message: string;

  @ApiProperty({
    example: {
      uuid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      user_uuid: 'user-uuid-example',
      start_date: '2025-06-01',
      end_date: '2025-06-03',
      reason: 'Izin acara keluarga',
      status: 'pending',
      file_url: 'http://localhost:4000/uploads/file-xyz.jpeg',
      createdAt: '2025-06-01T08:00:00.000Z',
      updatedAt: '2025-06-01T08:00:00.000Z',
    },
  })
  data: Permission;
}

export class GetPermissionThisMonthResponse {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Permissions fetched for this month' })
  message: string;

  @ApiProperty({
    example: [
      {
        uuid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        user_uuid: 'user-uuid-example',
        start_date: '2025-06-01',
        end_date: '2025-06-03',
        reason: 'Izin acara keluarga',
        status: 'approved',
        file_url: 'http://localhost:4000/uploads/file-xyz.jpeg',
        createdAt: '2025-06-01T08:00:00.000Z',
        updatedAt: '2025-06-01T09:00:00.000Z',
      },
    ],
  })
  data: Permission[];
}

export class UpdatePermissionStatusResponse {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Status perizinan berhasil diubah' })
  message: string;

  @ApiProperty({
    example: {
      uuid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      user_uuid: 'user-uuid-example',
      start_date: '2025-06-01',
      end_date: '2025-06-03',
      reason: 'Izin acara keluarga',
      status: 'rejected',
      file_url: 'http://localhost:4000/uploads/file-xyz.jpeg',
      createdAt: '2025-06-01T08:00:00.000Z',
      updatedAt: '2025-06-02T10:00:00.000Z',
    },
  })
  data: Permission;
}

export class GetPermissionDetailResponse {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Detail perizinan berhasil diambil' })
  message: string;

  @ApiProperty({
    example: {
      uuid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      user_uuid: 'user-uuid-example',
      start_date: '2025-06-01',
      end_date: '2025-06-03',
      reason: 'Izin acara keluarga',
      status: 'approved',
      file_url: 'http://localhost:4000/uploads/file-xyz.jpeg',
      createdAt: '2025-06-01T08:00:00.000Z',
      updatedAt: '2025-06-02T08:00:00.000Z',
    },
  })
  data: Permission;
}

export class DeletePermissionResponse {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Perizinan berhasil dihapus beserta file terkait' })
  message: string;
}
