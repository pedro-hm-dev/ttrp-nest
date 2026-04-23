import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FogArea, FogAreaDocument } from './schemas/fog-area.schema.js';
import { CreateFogAreaDto } from './dto/create-fog-area.dto.js';
import { UpdateFogAreaDto } from './dto/update-fog-area.dto.js';
import { CampaignsService } from '../campaigns/campaigns.service.js';

@Injectable()
export class FogAreasService {
  constructor(
    @InjectModel(FogArea.name) private fogAreaModel: Model<FogAreaDocument>,
    private campaignsService: CampaignsService,
  ) {}

  async create(
    dto: CreateFogAreaDto,
    userId: string,
  ): Promise<FogAreaDocument> {
    const campaign = await this.campaignsService.findById(dto.campaign_id);
    this.campaignsService.assertOwnerOrMaster(campaign, userId);

    return this.fogAreaModel.create({
      shape: dto.shape,
      points: dto.points,
      revealed: dto.revealed ?? true,
      scene: dto.scene_id,
      campaign: dto.campaign_id,
    });
  }

  async findByScene(sceneId: string): Promise<FogAreaDocument[]> {
    return this.fogAreaModel.find({ scene: sceneId }).exec();
  }

  async findById(id: string): Promise<FogAreaDocument> {
    const fogArea = await this.fogAreaModel.findById(id).exec();
    if (!fogArea) throw new NotFoundException('Fog area not found');
    return fogArea;
  }

  async update(
    id: string,
    dto: UpdateFogAreaDto,
    userId: string,
  ): Promise<FogAreaDocument> {
    const fogArea = await this.findById(id);
    const campaign = await this.campaignsService.findById(
      fogArea.campaign.toString(),
    );
    this.campaignsService.assertOwnerOrMaster(campaign, userId);

    Object.assign(fogArea, dto);
    return fogArea.save();
  }

  async remove(id: string, userId: string): Promise<void> {
    const fogArea = await this.findById(id);
    const campaign = await this.campaignsService.findById(
      fogArea.campaign.toString(),
    );
    this.campaignsService.assertOwnerOrMaster(campaign, userId);

    await fogArea.deleteOne();
  }

  async resetScene(
    sceneId: string,
    userId: string,
  ): Promise<{ deleted: number }> {
    const areas = await this.fogAreaModel.find({ scene: sceneId }).exec();
    if (areas.length === 0) return { deleted: 0 };

    const campaign = await this.campaignsService.findById(
      areas[0].campaign.toString(),
    );
    this.campaignsService.assertOwnerOrMaster(campaign, userId);

    const result = await this.fogAreaModel
      .deleteMany({ scene: sceneId })
      .exec();
    return { deleted: result.deletedCount };
  }
}
