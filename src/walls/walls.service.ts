import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wall, WallDocument } from './schemas/wall.schema.js';
import { CreateWallDto } from './dto/create-wall.dto.js';
import { UpdateWallDto } from './dto/update-wall.dto.js';
import { CampaignsService } from '../campaigns/campaigns.service.js';

@Injectable()
export class WallsService {
  constructor(
    @InjectModel(Wall.name) private wallModel: Model<WallDocument>,
    private campaignsService: CampaignsService,
  ) {}

  async create(dto: CreateWallDto, userId: string): Promise<WallDocument> {
    const campaign = await this.campaignsService.findById(dto.campaign_id);
    this.campaignsService.assertOwnerOrMaster(campaign, userId);

    return this.wallModel.create({
      type: dto.type,
      points: dto.points,
      blocksVision: dto.blocksVision ?? true,
      blocksMovement: dto.blocksMovement ?? true,
      oneWay: dto.oneWay ?? false,
      color: dto.color,
      scene: dto.scene_id,
      campaign: dto.campaign_id,
    });
  }

  async findByScene(sceneId: string): Promise<WallDocument[]> {
    return this.wallModel.find({ scene: sceneId }).exec();
  }

  async findById(id: string): Promise<WallDocument> {
    const wall = await this.wallModel.findById(id).exec();
    if (!wall) throw new NotFoundException('Wall not found');
    return wall;
  }

  async update(
    id: string,
    dto: UpdateWallDto,
    userId: string,
  ): Promise<WallDocument> {
    const wall = await this.findById(id);
    const campaign = await this.campaignsService.findById(
      wall.campaign.toString(),
    );
    this.campaignsService.assertOwnerOrMaster(campaign, userId);

    Object.assign(wall, dto);
    return wall.save();
  }

  async remove(id: string, userId: string): Promise<void> {
    const wall = await this.findById(id);
    const campaign = await this.campaignsService.findById(
      wall.campaign.toString(),
    );
    this.campaignsService.assertOwnerOrMaster(campaign, userId);

    await wall.deleteOne();
  }

  async clearScene(
    sceneId: string,
    userId: string,
  ): Promise<{ deleted: number }> {
    const walls = await this.wallModel.find({ scene: sceneId }).exec();
    if (walls.length === 0) return { deleted: 0 };

    const campaign = await this.campaignsService.findById(
      walls[0].campaign.toString(),
    );
    this.campaignsService.assertOwnerOrMaster(campaign, userId);

    const result = await this.wallModel.deleteMany({ scene: sceneId }).exec();
    return { deleted: result.deletedCount };
  }
}
