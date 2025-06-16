import { Test, TestingModule } from '@nestjs/testing';
import { MeetingInvitationsService } from './meeting-invitations.service';

describe('MeetingInvitationsService', () => {
  let service: MeetingInvitationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeetingInvitationsService],
    }).compile();

    service = module.get<MeetingInvitationsService>(MeetingInvitationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
