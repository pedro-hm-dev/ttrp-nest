import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Handout, HandoutSchema } from './schemas/handout.schema.js';
import { HandoutsService } from './handouts.service.js';
import { HandoutsController } from './handouts.controller.js';
import { CampaignsModule } from '../campaigns/campaigns.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Handout.name, schema: HandoutSchema }]),
    CampaignsModule,
  ],
  providers: [HandoutsService],
  controllers: [HandoutsController],
  exports: [HandoutsService],
})
export class HandoutsModule {}
