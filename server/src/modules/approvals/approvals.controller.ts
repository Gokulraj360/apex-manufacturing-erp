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
import { ApprovalsService } from './approvals.service';
import { MfaSignoffDto, QueryApprovalsDto } from './dto/approvals.dto';

@Controller(['approvals', 'api/approvals'])
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  @Get('high-value')
  async getHighValueApprovals(@Query() query: QueryApprovalsDto) {
    return this.approvalsService.getHighValueApprovals(query);
  }

  @Post('high-value/:id/mfa-signoff')
  @HttpCode(HttpStatus.OK)
  async mfaSignoff(
    @Param('id') id: string,
    @Body() dto: MfaSignoffDto
  ) {
    return this.approvalsService.mfaSignoff(id, dto);
  }
}
