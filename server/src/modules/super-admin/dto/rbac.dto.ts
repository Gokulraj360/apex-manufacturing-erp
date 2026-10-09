export interface CreateRoleDto {
  name: string;
  description?: string;
  hierarchyLevel: number;
  permissionIds?: string[];
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
  hierarchyLevel?: number;
}

export interface CreatePermissionDto {
  action: string;
  resource: string;
  description?: string;
}

export interface AssignPermissionsDto {
  roleId: string;
  permissionIds: string[];
}

export interface RevokePermissionsDto {
  roleId: string;
  permissionIds: string[];
}

export interface AssignUserRoleDto {
  userId: string;
  roleId: string;
}
