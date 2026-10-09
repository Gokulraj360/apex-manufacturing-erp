import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { QualityFlagService } from '../services/quality-flag.service';
import { LogScrapDto, FlagQualityHoldDto } from '../dto/quality-flag.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/production/quality')
@UseGuards(RBACGuard)
export class QualityFlagController {
  constructor(private readonly qualityService: QualityFlagService) {}

  @Get('scrap-logs')
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getScrapLogs() {
    return this.qualityService.getScrapLogs();
  }

  @Post('log-scrap')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async logScrap(@Body() dto: LogScrapDto, @Req() req: any) {
    const inspectorUserId = req.user?.id;
    return this.qualityService.logScrap(dto, inspectorUserId);
  }

  @Post('quality-hold')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async flagQualityHold(@Body() dto: FlagQualityHoldDto, @Req() req: any) {
    const inspectorUserId = req.user?.id;
    return this.qualityService.flagQualityHold(dto, inspectorUserId);
  }
}
