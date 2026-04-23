import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Campaign, CampaignDocument } from './schemas/campaign.schema.js';
import { CreateCampaignDto } from './dto/create-campaign.dto.js';
import { UpdateCampaignDto } from './dto/update-campaign.dto.js';
import { UsersService } from '../users/users.service.js';
import { CampaignRole } from '../common/enums/campaign-role.enum.js';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectModel(Campaign.name)
    private campaignModel: Model<CampaignDocument>,
    private usersService: UsersService,
  ) {}

  async create(
    dto: CreateCampaignDto,
    ownerId: string,
  ): Promise<CampaignDocument> {
    return this.campaignModel.create({ ...dto, owner: ownerId });
  }

  async findAllByUser(userId: string): Promise<CampaignDocument[]> {
    return this.campaignModel
      .find({
        $or: [{ owner: userId }, { players: userId }],
      })
      .populate('owner', 'name email')
      .exec();
  }

  async findById(id: string): Promise<CampaignDocument> {
    const campaign = await this.campaignModel
      .findById(id)
      .populate('owner', 'name email')
      .populate('players', 'name email')
      .exec();
    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }

  async update(
    id: string,
    dto: UpdateCampaignDto,
    userId: string,
  ): Promise<CampaignDocument> {
    const campaign = await this.findById(id);
    this.assertOwnerOrMaster(campaign, userId);
    Object.assign(campaign, dto);
    return campaign.save();
  }

  async remove(id: string, userId: string): Promise<void> {
    const campaign = await this.findById(id);
    this.assertOwner(campaign, userId);
    await campaign.deleteOne();
  }

  async invitePlayer(
    campaignId: string,
    email: string,
    role: CampaignRole,
    userId: string,
  ): Promise<CampaignDocument> {
    const campaign = await this.findById(campaignId);
    this.assertOwnerOrMaster(campaign, userId);

    const player = await this.usersService.findByEmail(email);
    if (!player) throw new NotFoundException('User not found with that email');

    const playerId = player._id;

    if (campaign.players.some((p) => p.equals(playerId))) {
      return campaign;
    }

    campaign.players.push(playerId);
    campaign.permissions.push({ player: playerId, role });
    campaign.markModified('permissions');
    return campaign.save();
  }

  async removePlayer(
    campaignId: string,
    playerId: string,
    userId: string,
  ): Promise<CampaignDocument> {
    const campaign = await this.findById(campaignId);
    this.assertOwnerOrMaster(campaign, userId);

    campaign.players = campaign.players.filter(
      (p) => !p.equals(new Types.ObjectId(playerId)),
    );
    campaign.permissions = campaign.permissions.filter(
      (p) => !p.player.equals(new Types.ObjectId(playerId)),
    );
    return campaign.save();
  }

  async setRole(
    campaignId: string,
    playerId: string,
    role: CampaignRole,
    userId: string,
  ): Promise<CampaignDocument> {
    const campaign = await this.findById(campaignId);
    this.assertOwner(campaign, userId);

    const targetId = new Types.ObjectId(playerId);
    const isPlayer = campaign.players.some((p) => p.equals(targetId));
    if (!isPlayer)
      throw new ForbiddenException('User is not a player in this campaign');

    const idx = campaign.permissions.findIndex((p) =>
      p.player.equals(targetId),
    );

    if (idx >= 0) {
      campaign.permissions[idx].role = role;
    } else {
      campaign.permissions.push({ player: targetId, role });
    }

    campaign.markModified('permissions');
    return campaign.save();
  }

  async removeRole(
    campaignId: string,
    playerId: string,
    userId: string,
  ): Promise<CampaignDocument> {
    const campaign = await this.findById(campaignId);
    this.assertOwner(campaign, userId);

    campaign.permissions = campaign.permissions.filter(
      (p) => !p.player.equals(new Types.ObjectId(playerId)),
    );
    return campaign.save();
  }

  assertOwner(campaign: CampaignDocument, userId: string): void {
    if (!campaign.owner._id.equals(new Types.ObjectId(userId))) {
      throw new ForbiddenException('Only the campaign owner can do this');
    }
  }

  assertOwnerOrMaster(campaign: CampaignDocument, userId: string): void {
    const uid = new Types.ObjectId(userId);
    if (campaign.owner._id.equals(uid)) return;

    const role = this.getPlayerRole(campaign, userId);
    if (role === CampaignRole.MASTER) return;

    throw new ForbiddenException(
      'Only the campaign owner or a master can do this',
    );
  }

  isMember(campaign: CampaignDocument, userId: string): boolean {
    const uid = new Types.ObjectId(userId);
    return (
      campaign.owner._id.equals(uid) ||
      campaign.players.some((p) => p.equals(uid))
    );
  }

  getPlayerRole(
    campaign: CampaignDocument,
    userId: string,
  ): CampaignRole | null {
    const uid = new Types.ObjectId(userId);
    const entry = campaign.permissions.find((p) => p.player.equals(uid));
    return entry?.role ?? null;
  }

  isOwnerOrMaster(campaign: CampaignDocument, userId: string): boolean {
    const uid = new Types.ObjectId(userId);
    if (campaign.owner._id.equals(uid)) return true;
    return this.getPlayerRole(campaign, userId) === CampaignRole.MASTER;
  }
}
