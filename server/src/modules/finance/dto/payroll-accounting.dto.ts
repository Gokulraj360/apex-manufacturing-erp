export interface ComputePayrollAccountingDto {
  periodMonth: number;
  periodYear: number;
  headcount: number;
  grossSalary: number;
  taxWithheld: number;
  employeeBenefits: number;
  employerProvidentFund: number;
}

export interface PostPayrollToGLDto {
  payrollAccountingRecordId: string;
  accountingPeriodId: string;
  payrollExpenseAccountId: string;
  taxPayableAccountId: string;
  cashBankAccountId: string;
  benefitsPayableAccountId: string;
}
