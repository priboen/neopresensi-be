import { Test, TestingModule } from '@nestjs/testing';
import { RtspStreamController } from './rtsp-stream.controller';
import { RtspStreamService } from './rtsp-stream.service';

describe('RtspStreamController', () => {
  let controller: RtspStreamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RtspStreamController],
      providers: [RtspStreamService],
    }).compile();

    controller = module.get<RtspStreamController>(RtspStreamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
