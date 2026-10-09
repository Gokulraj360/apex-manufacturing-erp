import { EmploymentStatus, EmploymentType } from '@prisma/client';

export class CreateEmployeeDto {
  employeeCode!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  phone!: string;
  departmentId!: string;
  designationId!: string;
  employmentStatus?: EmploymentStatus;
  employmentType?: EmploymentType;
  dateOfJoining!: string; // ISO date string
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  panOrTaxId?: string;
  aadhaarOrNationalId?: string;
  bankAccountNumber?: string;
  bankIfscOrRouting?: string;
  baseSalary!: number;
  hourlyOvertimeRate?: number;
  userId?: string;
}

export class UpdateEmployeeDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  departmentId?: string;
  designationId?: string;
  employmentStatus?: EmploymentStatus;
  employmentType?: EmploymentType;
  dateOfLeaving?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  panOrTaxId?: string;
  aadhaarOrNationalId?: string;
  bankAccountNumber?: string;
  bankIfscOrRouting?: string;
  baseSalary?: number;
  hourlyOvertimeRate?: number;
}

export class UploadOnboardingDocDto {
  employeeId!: string;
  documentName!: string;
  documentType!: string;
  documentUrl!: string;
  notes?: string;
}

export class VerifyOnboardingDocDto {
  verificationStatus!: 'VERIFIED' | 'REJECTED';
  notes?: string;
}
