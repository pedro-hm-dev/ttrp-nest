import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Scene, SceneSchema } from './schemas/scene.schema.js';
import { ScenesService } from './scenes.service.js';
import { ScenesController } from './scenes.controller.js';
import { CampaignsModule } from '../campaigns/campaigns.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Scene.name, schema: SceneSchema }]),
    CampaignsModule,
  ],
  providers: [ScenesService],
  controllers: [ScenesController],
  exports: [ScenesService],
})
export class ScenesModule {}
