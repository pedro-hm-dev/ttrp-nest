import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Scene, SceneDocument } from './schemas/scene.schema.js';
import { CreateSceneDto } from './dto/create-scene.dto.js';
import { UpdateSceneDto } from './dto/update-scene.dto.js';
import { CampaignsService } from '../campaigns/campaigns.service.js';

@Injectable()
export class ScenesService {
  constructor(
    @InjectModel(Scene.name) private sceneModel: Model<SceneDocument>,
    private campaignsService: CampaignsService,
  ) {}

  async create(dto: CreateSceneDto, userId: string): Promise<SceneDocument> {
    const campaign = await this.campaignsService.findById(dto.campaign_id);

    this.campaignsService.assertOwnerOrMaster(campaign, userId);

    return this.sceneModel.create({
      name: dto.name,
      background_image: dto.background_image,
      background_color: dto.background_color,
      grid_width: dto.grid_width,
      grid_height: dto.grid_height,
      grid_type: dto.grid_type,
      cell_size: dto.cell_size,
      description: dto.description,
      fog_of_war: dto.fog_of_war ?? false,
      is_active: dto.is_active ?? false,
      campaign: dto.campaign_id,
    });
  }

  async findByCampaign(campaignId: string): Promise<SceneDocument[]> {
    return this.sceneModel.find({ campaign: campaignId }).exec();
  }

  async findById(id: string): Promise<SceneDocument> {
    const scene = await this.sceneModel.findById(id).exec();
    if (!scene) throw new NotFoundException('Scene not found');
    return scene;
  }

  async update(
    id: string,
    dto: UpdateSceneDto,
    userId: string,
  ): Promise<SceneDocument> {
    const scene = await this.findById(id);
    const campaign = await this.campaignsService.findById(
      scene.campaign.toString(),
    );
    this.campaignsService.assertOwnerOrMaster(campaign, userId);

    Object.assign(scene, dto);
    return scene.save();
  }

  async remove(id: string, userId: string): Promise<void> {
    const scene = await this.findById(id);
    const campaign = await this.campaignsService.findById(
      scene.campaign.toString(),
    );
    this.campaignsService.assertOwnerOrMaster(campaign, userId);

    await scene.deleteOne();
  }
}
