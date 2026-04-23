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
import { FogAreasService } from './fog-areas.service.js';
import { CreateFogAreaDto } from './dto/create-fog-area.dto.js';
import { UpdateFogAreaDto } from './dto/update-fog-area.dto.js';

@ApiTags('Fog of War')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('fog-areas')
export class FogAreasController {
  constructor(private fogAreasService: FogAreasService) {}

  @Post()
  @ApiOperation({ summary: 'Reveal or fog an area (owner or master)' })
  create(
    @Body() dto: CreateFogAreaDto,
    @CurrentUser() user: { user_id: string },
  ) {
    return this.fogAreasService.create(dto, user.user_id);
  }

  @Get('scene/:scene_id')
  @ApiOperation({ summary: 'List all fog areas in a scene' })
  findByScene(@Param('scene_id', ParseObjectIdPipe) sceneId: string) {
    return this.fogAreasService.findByScene(sceneId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get fog area by ID' })
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.fogAreasService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update fog area (owner or master)' })
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateFogAreaDto,
    @CurrentUser() user: { user_id: string },
  ) {
    return this.fogAreasService.update(id, dto, user.user_id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete fog area (owner or master)' })
  remove(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() user: { user_id: string },
  ) {
    return this.fogAreasService.remove(id, user.user_id);
  }

  @Delete('scene/:scene_id/reset')
  @ApiOperation({ summary: 'Reset all fog areas in a scene (full re-fog)' })
  resetScene(
    @Param('scene_id', ParseObjectIdPipe) sceneId: string,
    @CurrentUser() user: { user_id: string },
  ) {
    return this.fogAreasService.resetScene(sceneId, user.user_id);
  }
}
