import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { BOMStructureService } from '../services/bom-structure.service';
import {
  CreateBOMMasterDto,
  UpdateBOMStructureDto,
  QueryBOMDto,
} from '../dto/bom-structure.dto';

@Controller('api/v1/design/bom')
export class BOMStructureController {
  constructor(private readonly bomService: BOMStructureService) {}

  @Get()
  async getBOMs(@Query() query: QueryBOMDto) {
    return this.bomService.getBOMs(query);
  }

  @Get('summary')
  async getBOMSummary() {
    return this.bomService.getBOMSummary();
  }

  @Get(':id')
  async getBOMById(@Param('id') id: string) {
    return this.bomService.getBOMById(id);
  }

  @Post()
  async createBOM(@Body() dto: CreateBOMMasterDto) {
    return this.bomService.createBOM(dto);
  }

  @Patch(':id')
  async updateBOM(
    @Param('id') id: string,
    @Body() dto: UpdateBOMStructureDto,
  ) {
    return this.bomService.updateBOM(id, dto);
  }
}
