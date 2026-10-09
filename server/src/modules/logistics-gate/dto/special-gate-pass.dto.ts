export interface CreateSpecialGatePassDto {
  passType: 'RETURNABLE_REPAIR' | 'NON_RETURNABLE_SCRAP' | 'RETURNABLE_PACKAGING' | 'EQUIPMENT_TRANSFER';
  itemDescription: string;
  serialPartNumbers?: string;
  quantity: number;
  vendorRecipient: string;
  purposeReason: string;
  isReturnable: boolean;
  expectedReturnDate?: Date | string;
  authorizedBy: string;
}

export interface VerifySpecialGatePassReturnDto {
  verifiedBySecurity: string;
  actualReturnedDate?: Date | string;
  remarks?: string;
}
