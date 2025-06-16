import { Test, TestingModule } from '@nestjs/testing';
import { MeetingInvitationsController } from './meeting-invitations.controller';
import { MeetingInvitationsService } from './meeting-invitations.service';

describe('MeetingInvitationsController', () => {
  let controller: MeetingInvitationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeetingInvitationsController],
      providers: [MeetingInvitationsService],
    }).compile();

    controller = module.get<MeetingInvitationsController>(MeetingInvitationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
