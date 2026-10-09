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
import { DigitalAssetService } from '../services/digital-asset.service';
import {
  CreateDigitalAssetDto,
  UpdateDigitalAssetDto,
  QueryDigitalAssetsDto,
} from '../dto/digital-asset.dto';

@Controller('api/v1/marketing/assets')
export class DigitalAssetController {
  constructor(private readonly assetService: DigitalAssetService) {}

  @Get()
  async getAssets(@Query() query: QueryDigitalAssetsDto) {
    return this.assetService.getAssets(query);
  }

  @Get('statistics')
  async getAssetStatistics() {
    return this.assetService.getAssetStatistics();
  }

  @Get(':id')
  async getAssetById(@Param('id') id: string) {
    return this.assetService.getAssetById(id);
  }

  @Post()
  async createAsset(@Body() dto: CreateDigitalAssetDto) {
    return this.assetService.createAsset(dto);
  }

  @Patch(':id')
  async updateAsset(
    @Param('id') id: string,
    @Body() dto: UpdateDigitalAssetDto,
  ) {
    return this.assetService.updateAsset(id, dto);
  }

  @Post(':id/download')
  async incrementDownload(@Param('id') id: string) {
    return this.assetService.incrementDownload(id);
  }

  @Delete(':id')
  async deleteAsset(@Param('id') id: string) {
    return this.assetService.deleteAsset(id);
  }
}
