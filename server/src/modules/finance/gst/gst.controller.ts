import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GstService, Gstr1Summary } from './gst.service';
import { PostGstr1Dto, QueryGstDto } from '../dto/gst.dto';

@Controller(['finance/gst', 'api/finance/gst'])
export class GstController {
  constructor(private readonly gstService: GstService) {}

  @Get('gstr-1')
  async getGstr1Summary(@Query() query: QueryGstDto): Promise<Gstr1Summary> {
    return this.gstService.getGstr1Summary(query.month);
  }

  @Post('post-gstr1')
  @HttpCode(HttpStatus.OK)
  async postGstr1WithMfa(@Body() dto: PostGstr1Dto) {
    return this.gstService.postGstr1WithMfa(dto);
  }
}
