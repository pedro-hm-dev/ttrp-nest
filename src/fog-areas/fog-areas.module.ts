import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FogArea, FogAreaSchema } from './schemas/fog-area.schema.js';
import { FogAreasService } from './fog-areas.service.js';
import { FogAreasController } from './fog-areas.controller.js';
import { CampaignsModule } from '../campaigns/campaigns.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FogArea.name, schema: FogAreaSchema }]),
    CampaignsModule,
  ],
  providers: [FogAreasService],
  controllers: [FogAreasController],
  exports: [FogAreasService],
})
export class FogAreasModule {}
