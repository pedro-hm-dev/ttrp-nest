import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe.js';
import { CampaignsService } from './campaigns.service.js';
import { CreateCampaignDto } from './dto/create-campaign.dto.js';
import { UpdateCampaignDto } from './dto/update-campaign.dto.js';
import { InvitePlayerDto } from './dto/invite-player.dto.js';
import { SetPermissionDto } from './dto/toggle-edit-permission.dto.js';

@ApiTags('Campaigns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('campaigns')
export class CampaignsController {
  constructor(private campaignsService: CampaignsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new campaign' })
  create(
    @Body() dto: CreateCampaignDto,
    @CurrentUser() user: { user_id: string },
  ) {
    return this.campaignsService.create(dto, user.user_id);
  }

  @Get()
  @ApiOperation({ summary: 'List campaigns where user is owner or player' })
  findAll(@CurrentUser() user: { user_id: string }) {
    return this.campaignsService.findAllByUser(user.user_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get campaign by ID' })
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.campaignsService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update campaign (owner only)' })
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateCampaignDto,
    @CurrentUser() user: { user_id: string },
  ) {
    return this.campaignsService.update(id, dto, user.user_id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete campaign (owner only)' })
  remove(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() user: { user_id: string },
  ) {
    return this.campaignsService.remove(id, user.user_id);
  }

  @Post(':id/invite')
  @ApiOperation({ summary: 'Invite player by email (owner only)' })
  invite(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: InvitePlayerDto,
    @CurrentUser() user: { user_id: string },
  ) {
    return this.campaignsService.invitePlayer(id, dto.email, user.user_id);
  }

  @Delete(':id/players/:player_id')
  @ApiOperation({ summary: 'Remove a player from campaign (owner only)' })
  removePlayer(
    @Param('id', ParseObjectIdPipe) id: string,
    @Param('player_id', ParseObjectIdPipe) playerId: string,
    @CurrentUser() user: { user_id: string },
  ) {
    return this.campaignsService.removePlayer(id, playerId, user.user_id);
  }

  @Patch(':id/permissions')
  @ApiOperation({ summary: 'Set permission level for a player (owner only)' })
  setPermission(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: SetPermissionDto,
    @CurrentUser() user: { user_id: string },
  ) {
    return this.campaignsService.setPermission(
      id,
      dto.player_id,
      dto.level,
      user.user_id,
    );
  }

  @Delete(':id/permissions/:player_id')
  @ApiOperation({ summary: 'Remove permission for a player (owner only)' })
  removePermission(
    @Param('id', ParseObjectIdPipe) id: string,
    @Param('player_id', ParseObjectIdPipe) playerId: string,
    @CurrentUser() user: { user_id: string },
  ) {
    return this.campaignsService.removePermission(id, playerId, user.user_id);
  }
}
