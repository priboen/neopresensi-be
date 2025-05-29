import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/common/models';

export class GetAllUserResponse {
  @ApiProperty({ example: 200 })
  statusCode: number;
  @ApiProperty({ example: 'Users retrieved successfully' })
  message: string;
  @ApiProperty({
    example: [
      {
        uuid: '6b84a91f-ab0c-48b7-b82a-5d5e9156f340',
        name: 'Muhamad Adri Muwaffaq Khamid',
        username: 'priboen',
        email: 'adri@mail.com',
        role: 'guru',
        face_embedding: null,
        createdAt: '2025-05-26T13:16:42.000Z',
        updatedAt: '2025-05-26T13:16:42.000Z',
      },
      {
        uuid: '6b84a91f-ab0c-48b7-b82a-5d5e9156f340',
        name: 'John Doe',
        username: 'johndoe',
        email: 'johndoe@mail.com',
        role: 'admin',
        face_embedding: null,
        createdAt: '2025-05-26T13:16:42.000Z',
        updatedAt: '2025-05-26T13:16:42.000Z',
      },
    ],
  })
  data: User[];
}

export class GetUserByIdResponse {
  @ApiProperty({ example: 200 })
  statusCode: number;
  @ApiProperty({ example: 'User retrieved successfully' })
  message: string;
  @ApiProperty({
    example: {
      uuid: '6b84a91f-ab0c-48b7-b82a-5d5e9156f340',
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@mail.com',
      role: 'admin',
      face_embedding: null,
      createdAt: '2025-05-26T13:16:42.000Z',
      updatedAt: '2025-05-26T13:16:42.000Z',
    },
  })
  data: User;
}

export class GetUserProfileResponse {
  @ApiProperty({ example: 200 })
  statusCode: number;
  @ApiProperty({ example: 'User profile retrieved successfully' })
  message: string;
  @ApiProperty({
    example: {
      uuid: '6b84a91f-ab0c-48b7-b82a-5d5e9156f340',
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@mail.com',
      role: 'admin',
      face_embedding: null,
      createdAt: '2025-05-26T13:16:42.000Z',
      updatedAt: '2025-05-26T13:16:42.000Z',
    },
  })
  data: User;
}

export class UpdateUserResponse {
  @ApiProperty({ example: 200 })
  statusCode: number;
  @ApiProperty({ example: 'User profile updated successfully' })
  message: string;
  @ApiProperty({
    example: {
      uuid: '6b84a91f-ab0c-48b7-b82a-5d5e9156f340',
      name: 'Adri Update',
      username: 'adrikhamid',
      email: 'adriupdate@mail.com',
      role: 'guru',
      face_embedding: null,
      createdAt: '2025-05-26T13:16:42.000Z',
      updatedAt: '2025-05-29T07:52:11.819Z',
    },
  })
  data: User;
}

export class DeleteUserResponse {
  @ApiProperty({ example: 200 })
  statusCode: number;
  @ApiProperty({
    example: 'User profile deleted successfully',
  })
  message: string;
}
