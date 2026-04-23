import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Drawing, DrawingDocument } from './schemas/drawing.schema.js';
import { CreateDrawingDto } from './dto/create-drawing.dto.js';
import { UpdateDrawingDto } from './dto/update-drawing.dto.js';
import { CampaignsService } from '../campaigns/campaigns.service.js';
import { MapLayer } from '../common/enums/map-layer.enum.js';

@Injectable()
export class DrawingsService {
  constructor(
    @InjectModel(Drawing.name) private drawingModel: Model<DrawingDocument>,
    private campaignsService: CampaignsService,
  ) {}

  async create(
    dto: CreateDrawingDto,
    userId: string,
  ): Promise<DrawingDocument> {
    const campaign = await this.campaignsService.findById(dto.campaign_id);

    if (dto.layer === MapLayer.DM) {
      this.campaignsService.assertOwnerOrMaster(campaign, userId);
    } else {
      this.campaignsService.assertOwnerOrMaster(campaign, userId);
    }

    return this.drawingModel.create({
      type: dto.type,
      layer: dto.layer ?? MapLayer.PLAYERS,
      points: dto.points,
      strokeColor: dto.strokeColor ?? '#000000',
      strokeWidth: dto.strokeWidth ?? 2,
      fillColor: dto.fillColor,
      opacity: dto.opacity ?? 1,
      text: dto.text,
      fontSize: dto.fontSize,
      radius: dto.radius,
      width: dto.width,
      height: dto.height,
      scene: dto.scene_id,
      campaign: dto.campaign_id,
      createdBy: userId,
    });
  }

  async findByScene(
    sceneId: string,
    userId: string,
  ): Promise<DrawingDocument[]> {
    const drawings = await this.drawingModel.find({ scene: sceneId }).exec();

    if (drawings.length === 0) return [];

    const campaign = await this.campaignsService.findById(
      drawings[0].campaign.toString(),
    );
    const isMaster = this.campaignsService.isOwnerOrMaster(campaign, userId);

    if (isMaster) return drawings;

    return drawings.filter((d) => d.layer !== MapLayer.DM);
  }

  async findById(id: string): Promise<DrawingDocument> {
    const drawing = await this.drawingModel.findById(id).exec();
    if (!drawing) throw new NotFoundException('Drawing not found');
    return drawing;
  }

  async update(
    id: string,
    dto: UpdateDrawingDto,
    userId: string,
  ): Promise<DrawingDocument> {
    const drawing = await this.findById(id);
    const campaign = await this.campaignsService.findById(
      drawing.campaign.toString(),
    );
    this.campaignsService.assertOwnerOrMaster(campaign, userId);

    Object.assign(drawing, dto);
    return drawing.save();
  }

  async remove(id: string, userId: string): Promise<void> {
    const drawing = await this.findById(id);
    const campaign = await this.campaignsService.findById(
      drawing.campaign.toString(),
    );
    this.campaignsService.assertOwnerOrMaster(campaign, userId);

    await drawing.deleteOne();
  }

  async clearScene(
    sceneId: string,
    layer: MapLayer | undefined,
    userId: string,
  ): Promise<{ deleted: number }> {
    const drawings = await this.drawingModel.find({ scene: sceneId }).exec();
    if (drawings.length === 0) return { deleted: 0 };

    const campaign = await this.campaignsService.findById(
      drawings[0].campaign.toString(),
    );
    this.campaignsService.assertOwnerOrMaster(campaign, userId);

    const filter: Record<string, unknown> = { scene: sceneId };
    if (layer) filter.layer = layer;

    const result = await this.drawingModel.deleteMany(filter).exec();
    return { deleted: result.deletedCount };
  }
}
