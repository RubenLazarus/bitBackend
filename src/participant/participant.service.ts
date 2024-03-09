import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { participant, participantDetails } from 'src/entities/participant.entity';

@Injectable()
export class ParticipantService {
    constructor(
        @InjectModel(participant.name) private participantRepository: Model<participantDetails>,
    ) { }
}
