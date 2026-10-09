export interface FunctionToggleItem {
  functionKey: string;
  isAllowed: boolean;
  notes?: string;
}

export class UpdateRolePermissionDto {
  roleName: string;
  permissions: FunctionToggleItem[];
  configuredBy?: string;
  notes?: string;
}

export class CheckFunctionAccessDto {
  roleName: string;
  functionKey: string;
}

export class BulkSyncPermissionsDto {
  roles: {
    roleName: string;
    permissions: FunctionToggleItem[];
  }[];
  configuredBy?: string;
}
