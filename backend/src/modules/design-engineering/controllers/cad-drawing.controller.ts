import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { CadDrawingService } from '../services/cad-drawing.service';
import {
  CreateCadModelDto,
  UpdateCadModelDto,
  CreateTechnicalDrawingDto,
  QueryCadModelsDto,
  QueryDrawingsDto,
} from '../dto/cad-drawing.dto';

@Controller('api/v1/design/cad')
export class CadDrawingController {
  constructor(private readonly cadService: CadDrawingService) {}

  @Get('models')
  async getCadModels(@Query() query: QueryCadModelsDto) {
    return this.cadService.getCadModels(query);
  }

  @Get('models/statistics')
  async getCadStatistics() {
    return this.cadService.getCadStatistics();
  }

  @Get('models/:id')
  async getCadModelById(@Param('id') id: string) {
    return this.cadService.getCadModelById(id);
  }

  @Post('models')
  async createCadModel(@Body() dto: CreateCadModelDto) {
    return this.cadService.createCadModel(dto);
  }

  @Patch('models/:id')
  async updateCadModel(
    @Param('id') id: string,
    @Body() dto: UpdateCadModelDto,
  ) {
    return this.cadService.updateCadModel(id, dto);
  }

  @Get('drawings')
  async getDrawings(@Query() query: QueryDrawingsDto) {
    return this.cadService.getDrawings(query);
  }

  @Get('drawings/:id')
  async getDrawingById(@Param('id') id: string) {
    return this.cadService.getDrawingById(id);
  }

  @Post('drawings')
  async createDrawing(@Body() dto: CreateTechnicalDrawingDto) {
    return this.cadService.createDrawing(dto);
  }
}
