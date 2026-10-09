import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SubcontractingService } from './subcontracting.service';
import {
  QuerySubcontractChallansDto,
  SettleChallanDto,
} from './dto/subcontracting.dto';

@Controller(['subcontracting', 'api/subcontracting'])
export class SubcontractingController {
  constructor(private readonly subcontractingService: SubcontractingService) {}

  @Get('challans')
  async findAll(@Query() query: QuerySubcontractChallansDto) {
    return this.subcontractingService.findAll(query);
  }

  @Get('challans/:id')
  async findOne(@Param('id') id: string) {
    return this.subcontractingService.findOne(id);
  }

  @Post('challans/:id/settle')
  @HttpCode(HttpStatus.OK)
  async settleChallan(
    @Param('id') id: string,
    @Body() dto: SettleChallanDto
  ) {
    return this.subcontractingService.settleChallan(id, dto);
  }
}
