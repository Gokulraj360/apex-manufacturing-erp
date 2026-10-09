import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { DepartmentOutputService } from '../services/department-output.service';
import {
  RecordTargetOutputDto,
  SignoffOutputDto,
  QueryOutputsDto,
} from '../dto/department-output.dto';

@Controller('api/v1/department-workforce/outputs')
export class DepartmentOutputController {
  constructor(
    private readonly outputService: DepartmentOutputService,
  ) {}

  @Get()
  async getOutputs(@Query() query: QueryOutputsDto) {
    return this.outputService.getOutputs(query);
  }

  @Get(':id')
  async getOutputById(@Param('id') id: string) {
    return this.outputService.getOutputById(id);
  }

  @Post()
  async recordOutput(@Body() dto: RecordTargetOutputDto) {
    return this.outputService.recordOutput(dto);
  }

  @Patch(':id/signoff')
  async signoffOutput(
    @Param('id') id: string,
    @Body() dto: SignoffOutputDto,
  ) {
    return this.outputService.signoffOutput(id, dto);
  }
}
