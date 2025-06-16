import { Test, TestingModule } from '@nestjs/testing';
import { CctvSchedulesController } from './cctv-schedules.controller';
import { CctvSchedulesService } from './cctv-schedules.service';

describe('CctvSchedulesController', () => {
  let controller: CctvSchedulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CctvSchedulesController],
      providers: [CctvSchedulesService],
    }).compile();

    controller = module.get<CctvSchedulesController>(CctvSchedulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
