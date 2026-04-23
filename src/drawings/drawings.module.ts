import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Drawing, DrawingSchema } from './schemas/drawing.schema.js';
import { DrawingsService } from './drawings.service.js';
import { DrawingsController } from './drawings.controller.js';
import { CampaignsModule } from '../campaigns/campaigns.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Drawing.name, schema: DrawingSchema }]),
    CampaignsModule,
  ],
  providers: [DrawingsService],
  controllers: [DrawingsController],
  exports: [DrawingsService],
})
export class DrawingsModule {}
