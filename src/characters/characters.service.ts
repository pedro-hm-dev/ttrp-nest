import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Character, CharacterDocument } from './schemas/character.schema.js';
import { CreateCharacterDto } from './dto/create-character.dto.js';
import { UpdateCharacterDto } from './dto/update-character.dto.js';
import { CampaignsService } from '../campaigns/campaigns.service.js';
import { CharacterPermission } from '../common/enums/character-permission.enum.js';

@Injectable()
export class CharactersService {
  constructor(
    @InjectModel(Character.name)
    private characterModel: Model<CharacterDocument>,
    private campaignsService: CampaignsService,
  ) {}

  async create(
    dto: CreateCharacterDto,
    userId: string,
  ): Promise<CharacterDocument> {
    const campaign = await this.campaignsService.findById(dto.campaign_id);

    if (!this.campaignsService.isMember(campaign, userId)) {
      throw new ForbiddenException('You are not a member of this campaign');
    }

    return this.characterModel.create({
      name: dto.name,
      avatar: dto.avatar,
      tokenImage: dto.tokenImage,
      attributes: dto.attributes ?? {},
      publicNotes: dto.publicNotes,
      gmNotes: dto.gmNotes,
      campaign: dto.campaign_id,
      owner: userId,
    });
  }

  async findByCampaign(campaignId: string): Promise<CharacterDocument[]> {
    return this.characterModel
      .find({ campaign: campaignId })
      .populate('owner', 'name email')
      .exec();
  }

  async findById(id: string): Promise<CharacterDocument> {
    const character = await this.characterModel
      .findById(id)
      .populate('owner', 'name email')
      .exec();
    if (!character) throw new NotFoundException('Character not found');
    return character;
  }

  async update(
    id: string,
    dto: UpdateCharacterDto,
    userId: string,
  ): Promise<CharacterDocument> {
    const character = await this.findById(id);
    const campaign = await this.campaignsService.findById(
      character.campaign.toString(),
    );

    if (!this.canEdit(campaign, character, userId)) {
      throw new ForbiddenException(
        'You do not have permission to edit this character',
      );
    }

    Object.assign(character, dto);
    return character.save();
  }

  async remove(id: string, userId: string): Promise<void> {
    const character = await this.findById(id);
    const campaign = await this.campaignsService.findById(
      character.campaign.toString(),
    );

    if (!this.campaignsService.isOwnerOrMaster(campaign, userId)) {
      const isOwnerOfCharacter = character.owner._id.toString() === userId;
      if (!isOwnerOfCharacter) {
        throw new ForbiddenException(
          'Only the campaign owner, a master, or the character owner can delete this character',
        );
      }
    }

    await character.deleteOne();
  }

  async setPermission(
    characterId: string,
    playerId: string,
    level: CharacterPermission,
    userId: string,
  ): Promise<CharacterDocument> {
    const character = await this.findById(characterId);
    const campaign = await this.campaignsService.findById(
      character.campaign.toString(),
    );

    const isOwner = character.owner._id.toString() === userId;
    if (!isOwner && !this.campaignsService.isOwnerOrMaster(campaign, userId)) {
      throw new ForbiddenException(
        'Only the character owner, campaign owner, or a master can set permissions',
      );
    }

    const targetId = new Types.ObjectId(playerId);
    if (!this.campaignsService.isMember(campaign, playerId)) {
      throw new ForbiddenException(
        'Target user is not a member of this campaign',
      );
    }

    const idx = character.permissions.findIndex((p) =>
      p.player.equals(targetId),
    );

    if (idx >= 0) {
      character.permissions[idx].level = level;
    } else {
      character.permissions.push({ player: targetId, level });
    }

    character.markModified('permissions');
    return character.save();
  }

  async removePermission(
    characterId: string,
    playerId: string,
    userId: string,
  ): Promise<CharacterDocument> {
    const character = await this.findById(characterId);
    const campaign = await this.campaignsService.findById(
      character.campaign.toString(),
    );

    const isOwner = character.owner._id.toString() === userId;
    if (!isOwner && !this.campaignsService.isOwnerOrMaster(campaign, userId)) {
      throw new ForbiddenException(
        'Only the character owner, campaign owner, or a master can remove permissions',
      );
    }

    character.permissions = character.permissions.filter(
      (p) => !p.player.equals(new Types.ObjectId(playerId)),
    );
    return character.save();
  }

  canEdit(
    campaign: any,
    character: CharacterDocument,
    userId: string,
  ): boolean {
    const uid = new Types.ObjectId(userId);

    if (this.campaignsService.isOwnerOrMaster(campaign, userId)) return true;
    if (character.owner._id.equals(uid)) return true;

    const charPerm = character.permissions.find((p) => p.player.equals(uid));
    return charPerm?.level === CharacterPermission.EDIT;
  }

  canView(
    campaign: any,
    character: CharacterDocument,
    userId: string,
  ): boolean {
    if (this.canEdit(campaign, character, userId)) return true;

    const uid = new Types.ObjectId(userId);
    const charPerm = character.permissions.find((p) => p.player.equals(uid));
    return charPerm?.level === CharacterPermission.VIEW;
  }
}
