import { Controller, Inject } from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IParticipantService } from './participant';

@Controller(Routes.PARTICIPANT)
export class ParticipantController {
    constructor(
        @Inject(Services.PARTICIPANT)
        private readonly ParticipantService: IParticipantService,
      ) {}
}
