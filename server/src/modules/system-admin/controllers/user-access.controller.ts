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
import { UserAccessService } from '../services/user-access.service';
import {
  CreateUserAccountDto,
  UpdateUserAccountDto,
  ResetPasswordDto,
  RevokeAccessDto,
  AssignPermissionDto,
} from '../dto/user-access.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/system-admin/users')
@UseGuards(RBACGuard)
export class UserAccessController {
  constructor(private readonly userAccessService: UserAccessService) {}

  @Get()
  @RequirePermissions({ action: 'READ', resource: 'SYSTEM_ADMIN' })
  async getUsers(
    @Query('search') search?: string,
    @Query('roleId') roleId?: string,
  ) {
    return this.userAccessService.getUserAccounts(search, roleId);
  }

  @Get(':id')
  @RequirePermissions({ action: 'READ', resource: 'SYSTEM_ADMIN' })
  async getUserById(@Param('id') id: string) {
    return this.userAccessService.getUserAccountById(id);
  }

  @Post()
  @RequirePermissions({ action: 'WRITE', resource: 'SYSTEM_ADMIN' })
  async createUser(@Body() dto: CreateUserAccountDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.userAccessService.createUserAccount(dto, adminUserId);
  }

  @Put(':id')
  @RequirePermissions({ action: 'WRITE', resource: 'SYSTEM_ADMIN' })
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserAccountDto,
    @Req() req: any,
  ) {
    const adminUserId = req.user?.id;
    return this.userAccessService.updateUserAccount(id, dto, adminUserId);
  }

  @Post('reset-password')
  @RequirePermissions({ action: 'WRITE', resource: 'SYSTEM_ADMIN' })
  async resetPassword(@Body() dto: ResetPasswordDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.userAccessService.resetPassword(dto, adminUserId);
  }

  @Post('revoke')
  @RequirePermissions({ action: 'WRITE', resource: 'SYSTEM_ADMIN' })
  async revokeAccess(@Body() dto: RevokeAccessDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.userAccessService.revokeAccess(dto, adminUserId);
  }

  @Post('permissions')
  @RequirePermissions({ action: 'WRITE', resource: 'SYSTEM_ADMIN' })
  async assignPermission(@Body() dto: AssignPermissionDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.userAccessService.assignSystemPermission(dto, adminUserId);
  }

  @Get('permissions/matrix')
  @RequirePermissions({ action: 'READ', resource: 'SYSTEM_ADMIN' })
  async getPermissions(@Query('roleName') roleName?: string) {
    return this.userAccessService.getSystemPermissions(roleName);
  }
}
