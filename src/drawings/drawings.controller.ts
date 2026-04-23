import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe.js';
import { DrawingsService } from './drawings.service.js';
import { CreateDrawingDto } from './dto/create-drawing.dto.js';
import { UpdateDrawingDto } from './dto/update-drawing.dto.js';
import { MapLayer } from '../common/enums/map-layer.enum.js';

@ApiTags('Drawings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('drawings')
export class DrawingsController {
  constructor(private drawingsService: DrawingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a drawing on a scene (owner or master)' })
  create(
    @Body() dto: CreateDrawingDto,
    @CurrentUser() user: { user_id: string },
  ) {
    return this.drawingsService.create(dto, user.user_id);
  }

  @Get('scene/:scene_id')
  @ApiOperation({
    summary: 'List drawings in a scene (DM layer hidden for non-masters)',
  })
  findByScene(
    @Param('scene_id', ParseObjectIdPipe) sceneId: string,
    @CurrentUser() user: { user_id: string },
  ) {
    return this.drawingsService.findByScene(sceneId, user.user_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get drawing by ID' })
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.drawingsService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update drawing (owner or master)' })
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateDrawingDto,
    @CurrentUser() user: { user_id: string },
  ) {
    return this.drawingsService.update(id, dto, user.user_id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete drawing (owner or master)' })
  remove(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() user: { user_id: string },
  ) {
    return this.drawingsService.remove(id, user.user_id);
  }

  @Delete('scene/:scene_id/clear')
  @ApiOperation({
    summary: 'Clear all drawings in a scene (optional layer filter)',
  })
  @ApiQuery({ name: 'layer', enum: MapLayer, required: false })
  clearScene(
    @Param('scene_id', ParseObjectIdPipe) sceneId: string,
    @Query('layer') layer: MapLayer | undefined,
    @CurrentUser() user: { user_id: string },
  ) {
    return this.drawingsService.clearScene(sceneId, layer, user.user_id);
  }
}
