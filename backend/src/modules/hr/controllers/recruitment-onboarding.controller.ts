import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RecruitmentOnboardingService } from '../services/recruitment-onboarding.service';
import {
  CreateJobOpeningDto,
  UpdateJobOpeningDto,
  CreateCandidateDto,
  UpdateCandidateStageDto,
} from '../dto/recruitment.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/hr/recruitment')
@UseGuards(RBACGuard)
export class RecruitmentOnboardingController {
  constructor(private readonly recruitmentService: RecruitmentOnboardingService) {}

  @Get('metrics')
  @RequirePermissions({ action: 'READ', resource: 'HR' })
  async getRecruitmentMetrics() {
    return this.recruitmentService.getRecruitmentMetrics();
  }

  @Get('jobs')
  @RequirePermissions({ action: 'READ', resource: 'HR' })
  async getJobOpenings(
    @Query('departmentId') departmentId?: string,
    @Query('status') status?: string,
  ) {
    return this.recruitmentService.getJobOpenings(departmentId, status);
  }

  @Get('jobs/:id')
  @RequirePermissions({ action: 'READ', resource: 'HR' })
  async getJobOpeningById(@Param('id') id: string) {
    return this.recruitmentService.getJobOpeningById(id);
  }

  @Post('jobs')
  @RequirePermissions({ action: 'WRITE', resource: 'HR' })
  async createJobOpening(@Body() dto: CreateJobOpeningDto, @Req() req: any) {
    const hrUserId = req.user?.id;
    return this.recruitmentService.createJobOpening(dto, hrUserId);
  }

  @Put('jobs/:id')
  @RequirePermissions({ action: 'WRITE', resource: 'HR' })
  async updateJobOpening(
    @Param('id') id: string,
    @Body() dto: UpdateJobOpeningDto,
  ) {
    return this.recruitmentService.updateJobOpening(id, dto);
  }

  @Post('candidates')
  @RequirePermissions({ action: 'WRITE', resource: 'HR' })
  async createCandidate(@Body() dto: CreateCandidateDto) {
    return this.recruitmentService.createCandidate(dto);
  }

  @Put('candidates/:id/stage')
  @RequirePermissions({ action: 'WRITE', resource: 'HR' })
  async updateCandidateStage(
    @Param('id') id: string,
    @Body() dto: UpdateCandidateStageDto,
  ) {
    return this.recruitmentService.updateCandidateStage(id, dto);
  }
}
