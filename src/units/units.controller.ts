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
import { UnitsService } from './units.service.js';
import { CreateUnitDto } from './dto/create-unit.dto.js';
import { UpdateUnitDto } from './dto/update-unit.dto.js';

@ApiTags('Units')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('units')
export class UnitsController {
  constructor(private unitsService: UnitsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a unit (token/object/scenery) on a scene' })
  create(@Body() dto: CreateUnitDto, @CurrentUser() user: { user_id: string }) {
    return this.unitsService.create(dto, user.user_id);
  }

  @Get('scene/:scene_id')
  @ApiOperation({
    summary: 'List all units in a scene (DM layer filtered for non-masters)',
  })
  findByScene(
    @Param('scene_id', ParseObjectIdPipe) sceneId: string,
    @CurrentUser() user: { user_id: string },
  ) {
    return this.unitsService.findByScene(sceneId, user.user_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get unit by ID' })
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.unitsService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update unit (position, properties, layer, etc.)',
  })
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateUnitDto,
    @CurrentUser() user: { user_id: string },
  ) {
    return this.unitsService.update(id, dto, user.user_id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete unit (owner or master only)' })
  remove(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() user: { user_id: string },
  ) {
    return this.unitsService.remove(id, user.user_id);
  }
}
