import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { MaterialCatalogService } from '../services/material-catalog.service';
import {
  CreateMaterialCatalogItemDto,
  UpdateMaterialCatalogItemDto,
  CreateVendorContractTermsDto,
} from '../dto/material-catalog.dto';

@Controller('api/v1/procurement/catalog')
export class MaterialCatalogController {
  constructor(private readonly catalogService: MaterialCatalogService) {}

  @Get('items')
  async getCatalogItems(@Query() query: any) {
    return this.catalogService.getCatalogItems(query);
  }

  @Get('items/:sku')
  async getCatalogItemBySku(@Param('sku') sku: string) {
    return this.catalogService.getCatalogItemBySku(sku);
  }

  @Post('items')
  async createCatalogItem(@Body() dto: CreateMaterialCatalogItemDto) {
    return this.catalogService.createCatalogItem(dto);
  }

  @Patch('items/:sku')
  async updateCatalogItem(
    @Param('sku') sku: string,
    @Body() dto: UpdateMaterialCatalogItemDto,
  ) {
    return this.catalogService.updateCatalogItem(sku, dto);
  }

  @Get('contracts')
  async getContractTerms(@Query() query: any) {
    return this.catalogService.getContractTerms(query);
  }

  @Post('contracts')
  async createContractTerms(@Body() dto: CreateVendorContractTermsDto) {
    return this.catalogService.createContractTerms(dto);
  }
}
