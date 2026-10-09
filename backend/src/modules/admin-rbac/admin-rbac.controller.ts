import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Headers,
} from '@nestjs/common';
import { AdminRbacService } from './admin-rbac.service';
import {
  UpdateRolePermissionDto,
  CheckFunctionAccessDto,
  BulkSyncPermissionsDto,
} from './dto/admin-rbac.dto';

@Controller('api/v1/admin-rbac')
export class AdminRbacController {
  constructor(private readonly rbacService: AdminRbacService) {}

  @Get('functions-catalog')
  getFunctionsCatalog() {
    return this.rbacService.getFunctionsCatalog();
  }

  @Get('roles-summary')
  async getAllRolesSummary() {
    return this.rbacService.getAllRolesSummary();
  }

  @Get('permissions/:roleName')
  async getRolePermissions(@Param('roleName') roleName: string) {
    return this.rbacService.getRolePermissions(roleName);
  }

  @Post('permissions/update')
  async updateRolePermissions(
    @Body() dto: UpdateRolePermissionDto,
    @Headers('x-admin-user') adminUserHeader?: string,
  ) {
    if (!dto.configuredBy && adminUserHeader) {
      dto.configuredBy = adminUserHeader;
    }
    return this.rbacService.updateRolePermissions(dto);
  }

  @Post('permissions/reset/:roleName')
  async resetRoleToDefaults(
    @Param('roleName') roleName: string,
    @Headers('x-admin-user') adminUserHeader?: string,
  ) {
    const configuredBy = adminUserHeader || 'Super Admin';
    return this.rbacService.resetRoleToDefaults(roleName, configuredBy);
  }

  @Post('check-access')
  async checkFunctionAccess(@Body() dto: CheckFunctionAccessDto) {
    return this.rbacService.checkFunctionAccess(dto);
  }

  @Post('permissions/bulk-sync')
  async bulkSyncPermissions(
    @Body() dto: BulkSyncPermissionsDto,
    @Headers('x-admin-user') adminUserHeader?: string,
  ) {
    if (!dto.configuredBy && adminUserHeader) {
      dto.configuredBy = adminUserHeader;
    }
    return this.rbacService.bulkSyncPermissions(dto);
  }
}
