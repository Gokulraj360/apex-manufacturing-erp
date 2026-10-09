export interface CreateOutboundGateClearanceDto {
  deliveryChallanNumber: string;
  vehicleNumber: string;
  driverName: string;
  transporterName: string;
  destinationCity: string;
  securitySealNumber: string;
  gatePassNumber: string;
  isChallanMatched?: boolean;
  isPhysicalLoadVerified?: boolean;
  clearedByOfficer: string;
  remarks?: string;
}
