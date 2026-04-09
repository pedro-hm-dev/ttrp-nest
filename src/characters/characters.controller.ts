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
import { CharactersService } from './characters.service.js';
import { CreateCharacterDto } from './dto/create-character.dto.js';
import { UpdateCharacterDto } from './dto/update-character.dto.js';

@ApiTags('Characters')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('characters')
export class CharactersController {
  constructor(private charactersService: CharactersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a character in a campaign' })
  create(
    @Body() dto: CreateCharacterDto,
    @CurrentUser() user: { user_id: string },
  ) {
    return this.charactersService.create(dto, user.user_id);
  }

  @Get('campaign/:campaign_id')
  @ApiOperation({ summary: 'List all characters in a campaign' })
  findByCampaign(@Param('campaign_id', ParseObjectIdPipe) campaignId: string) {
    return this.charactersService.findByCampaign(campaignId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get character by ID' })
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.charactersService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update character (owner, campaign owner, or with permission)',
  })
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateCharacterDto,
    @CurrentUser() user: { user_id: string },
  ) {
    return this.charactersService.update(id, dto, user.user_id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete character (character owner or campaign owner)',
  })
  remove(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() user: { user_id: string },
  ) {
    return this.charactersService.remove(id, user.user_id);
  }
}
