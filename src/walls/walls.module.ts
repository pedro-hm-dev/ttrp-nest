import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Wall, WallSchema } from './schemas/wall.schema.js';
import { WallsService } from './walls.service.js';
import { WallsController } from './walls.controller.js';
import { CampaignsModule } from '../campaigns/campaigns.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Wall.name, schema: WallSchema }]),
    CampaignsModule,
  ],
  providers: [WallsService],
  controllers: [WallsController],
  exports: [WallsService],
})
export class WallsModule {}
