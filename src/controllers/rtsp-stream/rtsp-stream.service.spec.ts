import { Test, TestingModule } from '@nestjs/testing';
import { RtspStreamService } from './rtsp-stream.service';

describe('RtspStreamService', () => {
  let service: RtspStreamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RtspStreamService],
    }).compile();

    service = module.get<RtspStreamService>(RtspStreamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
