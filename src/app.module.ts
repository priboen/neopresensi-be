import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './controllers/auth/auth.module';
import { MysqlModule } from './common/modules';
import { UsersModule } from './controllers/users/users.module';
import { PermissionsModule } from './controllers/permissions/permissions.module';
import { FileUploadModule } from './controllers/file-upload/file-upload.module';
import { FaceEmbeddingModule } from './controllers/face-embedding/face-embedding.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MysqlModule,
    AuthModule,
    UsersModule,
    PermissionsModule,
    FileUploadModule,
    FaceEmbeddingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
