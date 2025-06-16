import { Test, TestingModule } from '@nestjs/testing';
import { CctvConfigsController } from './cctv-configs.controller';
import { CctvConfigsService } from './cctv-configs.service';

describe('CctvConfigsController', () => {
  let controller: CctvConfigsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CctvConfigsController],
      providers: [CctvConfigsService],
    }).compile();

    controller = module.get<CctvConfigsController>(CctvConfigsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
