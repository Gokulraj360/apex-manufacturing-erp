import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RBACService } from '../services/rbac.service';
import {
  CreateRoleDto,
  UpdateRoleDto,
  CreatePermissionDto,
  AssignPermissionsDto,
  RevokePermissionsDto,
  AssignUserRoleDto,
} from '../dto/rbac.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/super-admin/rbac')
@UseGuards(RBACGuard)
export class RBACController {
  constructor(private readonly rbacService: RBACService) {}

  @Get('roles')
  @RequirePermissions({ action: 'READ', resource: 'RBAC_SECURITY' })
  async getRoles() {
    return this.rbacService.getAllRoles();
  }

  @Get('permissions')
  @RequirePermissions({ action: 'READ', resource: 'RBAC_SECURITY' })
  async getPermissions() {
    return this.rbacService.getAllPermissions();
  }

  @Post('roles')
  @RequirePermissions({ action: 'WRITE', resource: 'RBAC_SECURITY' })
  async createRole(@Body() dto: CreateRoleDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.rbacService.createRole(dto, adminUserId);
  }

  @Put('roles/:id')
  @RequirePermissions({ action: 'WRITE', resource: 'RBAC_SECURITY' })
  async updateRole(
    @Param('id') id: string,
    @Body() dto: UpdateRoleDto,
    @Req() req: any,
  ) {
    const adminUserId = req.user?.id;
    return this.rbacService.updateRole(id, dto, adminUserId);
  }

  @Delete('roles/:id')
  @RequirePermissions({ action: 'WRITE', resource: 'RBAC_SECURITY' })
  async deleteRole(@Param('id') id: string, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.rbacService.deleteRole(id, adminUserId);
  }

  @Post('permissions')
  @RequirePermissions({ action: 'WRITE', resource: 'RBAC_SECURITY' })
  async createPermission(@Body() dto: CreatePermissionDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.rbacService.createPermission(dto, adminUserId);
  }

  @Post('assign-permissions')
  @RequirePermissions({ action: 'WRITE', resource: 'RBAC_SECURITY' })
  async assignPermissions(@Body() dto: AssignPermissionsDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.rbacService.assignPermissions(dto, adminUserId);
  }

  @Post('revoke-permissions')
  @RequirePermissions({ action: 'WRITE', resource: 'RBAC_SECURITY' })
  async revokePermissions(@Body() dto: RevokePermissionsDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.rbacService.revokePermissions(dto, adminUserId);
  }

  @Post('assign-user-role')
  @RequirePermissions({ action: 'WRITE', resource: 'RBAC_SECURITY' })
  async assignUserRole(@Body() dto: AssignUserRoleDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.rbacService.assignUserRole(dto, adminUserId);
  }
}
