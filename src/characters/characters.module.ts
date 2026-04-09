import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Character, CharacterSchema } from './schemas/character.schema.js';
import { CharactersService } from './characters.service.js';
import { CharactersController } from './characters.controller.js';
import { CampaignsModule } from '../campaigns/campaigns.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Character.name, schema: CharacterSchema },
    ]),
    CampaignsModule,
  ],
  providers: [CharactersService],
  controllers: [CharactersController],
  exports: [CharactersService],
})
export class CharactersModule {}
