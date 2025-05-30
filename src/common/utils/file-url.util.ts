import { ConfigService } from '@nestjs/config';

export function getFullFileUrl(
  filePath: string,
  configService: ConfigService,
): string {
  const host = configService.get<string>('APP_HOST');
  const normalizedPath = filePath.startsWith('/') ? filePath : '/' + filePath;

  return `${host}${normalizedPath}`;
}
