import { Injectable } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, multerConfig } from '../configs';

@Injectable()
export class FileUploadInterceptor extends FileInterceptor('file', {
  storage: multerConfig.storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}) {}