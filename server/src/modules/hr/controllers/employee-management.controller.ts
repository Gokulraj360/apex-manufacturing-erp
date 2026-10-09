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
import { EmployeeManagementService } from '../services/employee-management.service';
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  UploadOnboardingDocDto,
  VerifyOnboardingDocDto,
} from '../dto/employee.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { EmploymentStatus } from '@prisma/client';

@Controller('api/v1/hr/employees')
@UseGuards(RBACGuard)
export class EmployeeManagementController {
  constructor(private readonly employeeService: EmployeeManagementService) {}

  @Get()
  @RequirePermissions({ action: 'READ', resource: 'HR' })
  async getEmployees(
    @Query('departmentId') departmentId?: string,
    @Query('designationId') designationId?: string,
    @Query('status') status?: EmploymentStatus,
    @Query('search') search?: string,
  ) {
    return this.employeeService.getEmployees({ departmentId, designationId, status, search });
  }

  @Get('telemetry')
  @RequirePermissions({ action: 'READ', resource: 'HR' })
  async getHeadcountTelemetry() {
    return this.employeeService.getHeadcountTelemetry();
  }

  @Get('departments')
  @RequirePermissions({ action: 'READ', resource: 'HR' })
  async getDepartments() {
    return this.employeeService.getDepartments();
  }

  @Get('designations')
  @RequirePermissions({ action: 'READ', resource: 'HR' })
  async getDesignations() {
    return this.employeeService.getDesignations();
  }

  @Get(':id')
  @RequirePermissions({ action: 'READ', resource: 'HR' })
  async getEmployeeById(@Param('id') id: string) {
    return this.employeeService.getEmployeeById(id);
  }

  @Post()
  @RequirePermissions({ action: 'WRITE', resource: 'HR' })
  async createEmployee(@Body() dto: CreateEmployeeDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.employeeService.createEmployee(dto, adminUserId);
  }

  @Put(':id')
  @RequirePermissions({ action: 'WRITE', resource: 'HR' })
  async updateEmployee(
    @Param('id') id: string,
    @Body() dto: UpdateEmployeeDto,
    @Req() req: any,
  ) {
    const adminUserId = req.user?.id;
    return this.employeeService.updateEmployee(id, dto, adminUserId);
  }

  @Post('documents')
  @RequirePermissions({ action: 'WRITE', resource: 'HR' })
  async uploadOnboardingDocument(@Body() dto: UploadOnboardingDocDto) {
    return this.employeeService.uploadOnboardingDocument(dto);
  }

  @Put('documents/:id/verify')
  @RequirePermissions({ action: 'WRITE', resource: 'HR' })
  async verifyOnboardingDocument(
    @Param('id') id: string,
    @Body() dto: VerifyOnboardingDocDto,
    @Req() req: any,
  ) {
    const guardOrHrId = req.user?.id;
    return this.employeeService.verifyOnboardingDocument(id, dto, guardOrHrId);
  }
}
