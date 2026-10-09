export interface CreateInboundTransportCheckDto {
  vehicleNumber: string;
  poNumber: string;
  supplierName: string;
  transporterName: string;
  eWayBillNumber: string;
  supplierChallanNumber: string;
  declaredWeightKg: number;
  weighbridgeGrossKg: number;
  dockAssigned?: string;
  verifiedBy: string;
}

export interface CompleteWeighbridgeTareDto {
  weighbridgeTareKg: number;
  verifiedBy: string;
}
