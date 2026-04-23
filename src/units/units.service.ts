import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Unit, UnitDocument } from './schemas/unit.schema.js';
import { CreateUnitDto } from './dto/create-unit.dto.js';
import { UpdateUnitDto } from './dto/update-unit.dto.js';
import { CampaignsService } from '../campaigns/campaigns.service.js';
import { CampaignRole } from '../common/enums/campaign-role.enum.js';
import { MapLayer } from '../common/enums/map-layer.enum.js';

@Injectable()
export class UnitsService {
  constructor(
    @InjectModel(Unit.name) private unitModel: Model<UnitDocument>,
    private campaignsService: CampaignsService,
  ) {}

  async create(dto: CreateUnitDto, userId: string): Promise<UnitDocument> {
    const campaign = await this.campaignsService.findById(dto.campaign_id);

    if (dto.layer === MapLayer.DM) {
      this.campaignsService.assertOwnerOrMaster(campaign, userId);
    } else {
      if (!this.campaignsService.isMember(campaign, userId)) {
        throw new ForbiddenException('You are not a member of this campaign');
      }
      const role = this.campaignsService.getPlayerRole(campaign, userId);
      if (
        role === CampaignRole.VIEW &&
        !this.campaignsService.isOwnerOrMaster(campaign, userId)
      ) {
        throw new ForbiddenException('Observers cannot create units');
      }
    }

    return this.unitModel.create({
      name: dto.name,
      type: dto.type,
      layer: dto.layer ?? MapLayer.PLAYERS,
      x: dto.x ?? 0,
      y: dto.y ?? 0,
      width: dto.width ?? 1,
      height: dto.height ?? 1,
      rotation: dto.rotation ?? 0,
      tokenImage: dto.tokenImage,
      character: dto.character,
      properties: dto.properties ?? {},
      locked: dto.locked ?? false,
      visible: dto.visible ?? true,
      scene: dto.scene_id,
      campaign: dto.campaign_id,
    });
  }

  async findByScene(sceneId: string, userId: string): Promise<UnitDocument[]> {
    const units = await this.unitModel
      .find({ scene: sceneId })
      .populate('character', 'name tokenImage')
      .exec();

    const firstUnit = units[0];
    if (!firstUnit) return [];

    const campaign = await this.campaignsService.findById(
      firstUnit.campaign.toString(),
    );
    const isMaster = this.campaignsService.isOwnerOrMaster(campaign, userId);

    if (isMaster) return units;

    return units.filter((u) => u.layer !== MapLayer.DM && u.visible);
  }

  async findById(id: string): Promise<UnitDocument> {
    const unit = await this.unitModel
      .findById(id)
      .populate('character', 'name tokenImage')
      .exec();
    if (!unit) throw new NotFoundException('Unit not found');
    return unit;
  }

  async update(
    id: string,
    dto: UpdateUnitDto,
    userId: string,
  ): Promise<UnitDocument> {
    const unit = await this.findById(id);
    const campaign = await this.campaignsService.findById(
      unit.campaign.toString(),
    );

    const isMaster = this.campaignsService.isOwnerOrMaster(campaign, userId);

    if (unit.layer === MapLayer.DM && !isMaster) {
      throw new ForbiddenException('Only masters can edit DM layer units');
    }

    if (unit.locked && !isMaster) {
      throw new ForbiddenException('This unit is locked');
    }

    if (!isMaster) {
      const role = this.campaignsService.getPlayerRole(campaign, userId);
      if (role === CampaignRole.VIEW) {
        throw new ForbiddenException('Observers cannot edit units');
      }

      if (unit.character) {
        const uid = new Types.ObjectId(userId);
        if (!unit.character.equals(uid)) {
          // Players can only move units linked to their own characters
          // Allow position-only updates for units linked to other characters
          const positionOnly =
            Object.keys(dto).every((k) => ['x', 'y', 'rotation'].includes(k)) &&
            Object.keys(dto).length > 0;
          if (!positionOnly) {
            throw new ForbiddenException(
              'You can only move your own character units',
            );
          }
        }
      }
    }

    if (dto.layer === MapLayer.DM && !isMaster) {
      throw new ForbiddenException('Only masters can move units to DM layer');
    }

    Object.assign(unit, dto);
    return unit.save();
  }

  async remove(id: string, userId: string): Promise<void> {
    const unit = await this.findById(id);
    const campaign = await this.campaignsService.findById(
      unit.campaign.toString(),
    );
    this.campaignsService.assertOwnerOrMaster(campaign, userId);

    await unit.deleteOne();
  }

  async bulkUpdatePositions(
    updates: { id: string; x: number; y: number }[],
    userId: string,
  ): Promise<void> {
    for (const u of updates) {
      await this.update(u.id, { x: u.x, y: u.y }, userId);
    }
  }

  async findBySceneAndLayer(
    sceneId: string,
    layer: MapLayer,
  ): Promise<UnitDocument[]> {
    return this.unitModel
      .find({ scene: sceneId, layer })
      .populate('character', 'name tokenImage')
      .exec();
  }
}
