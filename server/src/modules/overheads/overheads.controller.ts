import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { OverheadsService } from './overheads.service';
import { CreateOverheadDto, UpdateOverheadDto } from './dto/overhead.dto';

@Controller('plant-overheads')
export class OverheadsController {
  constructor(private readonly overheadsService: OverheadsService) {}

  @Get()
  async findAll(@Query('volume') volume?: string) {
    const monthlyTargetVolume = volume ? Number(volume) : 50000;
    return this.overheadsService.findAll(monthlyTargetVolume);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.overheadsService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateOverheadDto) {
    return this.overheadsService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateOverheadDto) {
    return this.overheadsService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.overheadsService.remove(id);
  }
}
