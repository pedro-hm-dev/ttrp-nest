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
import { ScenesService } from './scenes.service.js';
import { CreateSceneDto } from './dto/create-scene.dto.js';
import { UpdateSceneDto } from './dto/update-scene.dto.js';

@ApiTags('Scenes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('scenes')
export class ScenesController {
  constructor(private scenesService: ScenesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a scene in a campaign' })
  create(
    @Body() dto: CreateSceneDto,
    @CurrentUser() user: { user_id: string },
  ) {
    return this.scenesService.create(dto, user.user_id);
  }

  @Get('campaign/:campaign_id')
  @ApiOperation({ summary: 'List all scenes in a campaign' })
  findByCampaign(@Param('campaign_id', ParseObjectIdPipe) campaignId: string) {
    return this.scenesService.findByCampaign(campaignId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get scene by ID' })
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.scenesService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update scene (campaign owner only)' })
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateSceneDto,
    @CurrentUser() user: { user_id: string },
  ) {
    return this.scenesService.update(id, dto, user.user_id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete scene (campaign owner only)' })
  remove(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() user: { user_id: string },
  ) {
    return this.scenesService.remove(id, user.user_id);
  }
}
