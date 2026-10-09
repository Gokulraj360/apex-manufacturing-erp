import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { PrototypeTestingService } from '../services/prototype-testing.service';
import {
  CreatePrototypeTestLogDto,
  QueryPrototypeTestsDto,
} from '../dto/prototype-testing.dto';

@Controller('api/v1/design/prototype')
export class PrototypeTestingController {
  constructor(private readonly prototypeService: PrototypeTestingService) {}

  @Get('tests')
  async getTests(@Query() query: QueryPrototypeTestsDto) {
    return this.prototypeService.getTests(query);
  }

  @Get('tests/summary')
  async getTestingSummary() {
    return this.prototypeService.getTestingSummary();
  }

  @Get('tests/:id')
  async getTestById(@Param('id') id: string) {
    return this.prototypeService.getTestById(id);
  }

  @Post('tests')
  async createTest(@Body() dto: CreatePrototypeTestLogDto) {
    return this.prototypeService.createTest(dto);
  }
}
