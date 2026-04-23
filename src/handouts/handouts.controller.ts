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
import { HandoutsService } from './handouts.service.js';
import { CreateHandoutDto } from './dto/create-handout.dto.js';
import { UpdateHandoutDto } from './dto/update-handout.dto.js';

@ApiTags('Handouts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('handouts')
export class HandoutsController {
  constructor(private handoutsService: HandoutsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a handout (owner or master)' })
  create(
    @Body() dto: CreateHandoutDto,
    @CurrentUser() user: { user_id: string },
  ) {
    return this.handoutsService.create(dto, user.user_id);
  }

  @Get('campaign/:campaign_id')
  @ApiOperation({
    summary: 'List handouts in a campaign (filtered by visibility)',
  })
  findByCampaign(
    @Param('campaign_id', ParseObjectIdPipe) campaignId: string,
    @CurrentUser() user: { user_id: string },
  ) {
    return this.handoutsService.findByCampaign(campaignId, user.user_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get handout by ID (visibility enforced)' })
  findOne(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() user: { user_id: string },
  ) {
    return this.handoutsService.findById(id, user.user_id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update handout (owner or master)' })
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateHandoutDto,
    @CurrentUser() user: { user_id: string },
  ) {
    return this.handoutsService.update(id, dto, user.user_id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete handout (owner or master)' })
  remove(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() user: { user_id: string },
  ) {
    return this.handoutsService.remove(id, user.user_id);
  }
}
