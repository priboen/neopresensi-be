import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { userProvider } from 'src/common/providers';

@Module({
  controllers: [UsersController],
  providers: [UsersService, userProvider],
})
export class UsersModule {}
