import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Headers,
} from '@nestjs/common';
import { PricingPolicyService } from '../services/pricing-policy.service';
import {
  CheckPricePermissionDto,
  CreatePriceOverrideRequestDto,
  ReviewOverrideRequestDto,
  LogPriceModificationDto,
  QueryPriceAuditsDto,
} from '../dto/pricing-policy.dto';
import { PriceOverrideStatus } from '@prisma/client';

@Controller('api/v1/pricing-control')
export class PricingControlController {
  constructor(private readonly pricingService: PricingPolicyService) {}

  @Get('matrix')
  async getFullMatrix() {
    return this.pricingService.getFullPermissionMatrix();
  }

  @Get('matrix/:role')
  async getRolePermissions(@Param('role') role: string) {
    return this.pricingService.getRolePricingPermissions(role);
  }

  @Get('metrics')
  async getGovernanceMetrics() {
    return this.pricingService.getGovernanceMetrics();
  }

  @Post('check-permission')
  async checkPermission(@Body() dto: CheckPricePermissionDto) {
    return this.pricingService.checkPermission(dto);
  }

  @Get('override-requests')
  async getOverrideRequests(@Query('status') status?: PriceOverrideStatus) {
    return this.pricingService.getOverrideRequests(status);
  }

  @Post('override-requests')
  async createOverrideRequest(
    @Body() dto: CreatePriceOverrideRequestDto,
    @Headers('x-user-role') roleHeader?: string,
  ) {
    if (!dto.requesterRole && roleHeader) {
      dto.requesterRole = roleHeader;
    }
    return this.pricingService.createOverrideRequest(dto);
  }

  @Patch('override-requests/:id/review')
  async reviewOverrideRequest(
    @Param('id') id: string,
    @Body() dto: ReviewOverrideRequestDto,
  ) {
    return this.pricingService.reviewOverrideRequest(id, dto);
  }

  @Get('audits')
  async getPriceAudits(@Query() query: QueryPriceAuditsDto) {
    return this.pricingService.getPriceAuditHistory(query);
  }

  @Post('audits')
  async logPriceModification(@Body() dto: LogPriceModificationDto) {
    return this.pricingService.logPriceModification(dto);
  }

  @Post('sanitize')
  async sanitizePayload(
    @Body() body: { data: any; role: string },
  ) {
    return this.pricingService.sanitizeEntity(body.data, body.role);
  }
}
