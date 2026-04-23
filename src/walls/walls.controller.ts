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
import { WallsService } from './walls.service.js';
import { CreateWallDto } from './dto/create-wall.dto.js';
import { UpdateWallDto } from './dto/update-wall.dto.js';

@ApiTags('Walls')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('walls')
export class WallsController {
  constructor(private wallsService: WallsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a wall segment (owner or master)' })
  create(@Body() dto: CreateWallDto, @CurrentUser() user: { user_id: string }) {
    return this.wallsService.create(dto, user.user_id);
  }

  @Get('scene/:scene_id')
  @ApiOperation({ summary: 'List all walls in a scene' })
  findByScene(@Param('scene_id', ParseObjectIdPipe) sceneId: string) {
    return this.wallsService.findByScene(sceneId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get wall by ID' })
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.wallsService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update wall (owner or master)' })
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateWallDto,
    @CurrentUser() user: { user_id: string },
  ) {
    return this.wallsService.update(id, dto, user.user_id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete wall (owner or master)' })
  remove(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() user: { user_id: string },
  ) {
    return this.wallsService.remove(id, user.user_id);
  }

  @Delete('scene/:scene_id/clear')
  @ApiOperation({ summary: 'Clear all walls in a scene' })
  clearScene(
    @Param('scene_id', ParseObjectIdPipe) sceneId: string,
    @CurrentUser() user: { user_id: string },
  ) {
    return this.wallsService.clearScene(sceneId, user.user_id);
  }
}
