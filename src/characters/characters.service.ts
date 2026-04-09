import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Character, CharacterDocument } from './schemas/character.schema.js';
import { CreateCharacterDto } from './dto/create-character.dto.js';
import { UpdateCharacterDto } from './dto/update-character.dto.js';
import { CampaignsService } from '../campaigns/campaigns.service.js';

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
      attributes: dto.attributes ?? {},
      notes: dto.notes,
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

    if (
      !this.campaignsService.canEditCharacter(
        campaign,
        character.owner._id.toString(),
        userId,
      )
    ) {
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

    const isOwnerOfCampaign = campaign.owner._id.toString() === userId;
    const isOwnerOfCharacter = character.owner._id.toString() === userId;

    if (!isOwnerOfCampaign && !isOwnerOfCharacter) {
      throw new ForbiddenException(
        'Only the campaign owner or character owner can delete this character',
      );
    }

    await character.deleteOne();
  }
}
