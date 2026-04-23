import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Handout, HandoutDocument } from './schemas/handout.schema.js';
import { CreateHandoutDto } from './dto/create-handout.dto.js';
import { UpdateHandoutDto } from './dto/update-handout.dto.js';
import { CampaignsService } from '../campaigns/campaigns.service.js';

@Injectable()
export class HandoutsService {
  constructor(
    @InjectModel(Handout.name) private handoutModel: Model<HandoutDocument>,
    private campaignsService: CampaignsService,
  ) {}

  async create(
    dto: CreateHandoutDto,
    userId: string,
  ): Promise<HandoutDocument> {
    const campaign = await this.campaignsService.findById(dto.campaign_id);
    this.campaignsService.assertOwnerOrMaster(campaign, userId);

    return this.handoutModel.create({
      name: dto.name,
      body: dto.body,
      image: dto.image,
      gmNotes: dto.gmNotes,
      visibleTo: dto.visibleTo ?? [],
      campaign: dto.campaign_id,
    });
  }

  async findByCampaign(
    campaignId: string,
    userId: string,
  ): Promise<HandoutDocument[]> {
    const campaign = await this.campaignsService.findById(campaignId);
    const isMaster = this.campaignsService.isOwnerOrMaster(campaign, userId);

    if (isMaster) {
      return this.handoutModel.find({ campaign: campaignId }).exec();
    }

    const uid = new Types.ObjectId(userId);
    return this.handoutModel
      .find({
        campaign: campaignId,
        visibleTo: uid,
      })
      .select('-gmNotes')
      .exec();
  }

  async findById(id: string, userId: string): Promise<HandoutDocument> {
    const handout = await this.handoutModel.findById(id).exec();
    if (!handout) throw new NotFoundException('Handout not found');

    const campaign = await this.campaignsService.findById(
      handout.campaign.toString(),
    );
    const isMaster = this.campaignsService.isOwnerOrMaster(campaign, userId);

    if (!isMaster) {
      const uid = new Types.ObjectId(userId);
      const canSee = handout.visibleTo.some((p) => p.equals(uid));
      if (!canSee) throw new NotFoundException('Handout not found');

      handout.gmNotes = undefined;
    }

    return handout;
  }

  async update(
    id: string,
    dto: UpdateHandoutDto,
    userId: string,
  ): Promise<HandoutDocument> {
    const handout = await this.handoutModel.findById(id).exec();
    if (!handout) throw new NotFoundException('Handout not found');

    const campaign = await this.campaignsService.findById(
      handout.campaign.toString(),
    );
    this.campaignsService.assertOwnerOrMaster(campaign, userId);

    Object.assign(handout, dto);
    return handout.save();
  }

  async remove(id: string, userId: string): Promise<void> {
    const handout = await this.handoutModel.findById(id).exec();
    if (!handout) throw new NotFoundException('Handout not found');

    const campaign = await this.campaignsService.findById(
      handout.campaign.toString(),
    );
    this.campaignsService.assertOwnerOrMaster(campaign, userId);

    await handout.deleteOne();
  }
}
