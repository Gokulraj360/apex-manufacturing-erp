export class CreateUserAccountDto {
  email!: string;
  firstName!: string;
  lastName!: string;
  roleId!: string;
  password!: string;
  mfaEnabled?: boolean;
  allowedIpRanges?: string;
  sessionTimeoutMinutes?: number;
}

export class UpdateUserAccountDto {
  firstName?: string;
  lastName?: string;
  roleId?: string;
  isActive?: boolean;
  mfaEnabled?: boolean;
  allowedIpRanges?: string;
  sessionTimeoutMinutes?: number;
}

export class ResetPasswordDto {
  userId!: string;
  newPassword!: string;
  forceChangeOnNextLogin?: boolean;
}

export class RevokeAccessDto {
  userId!: string;
  reason!: string;
}

export class AssignPermissionDto {
  roleName!: string;
  resource!: string;
  action!: string;
  isAllowed!: boolean;
  scope?: string;
  expiresAt?: string;
}
