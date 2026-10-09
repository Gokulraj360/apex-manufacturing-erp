export interface CreateDispatchShipmentDto {
  deliveryChallanNumber: string;
  salesOrderNumber: string;
  customerName: string;
  carrierName: string;
  vehicleNumber: string;
  driverName: string;
  driverContact: string;
  gatePassNumber: string;
  sealNumber: string;
  totalWeightKg: number;
  cartonsCount: number;
  loadedBy: string;
  estimatedDelivery?: Date | string;
}

export interface VerifyVehicleLoadingDto {
  sealNumber: string;
  gatePassNumber: string;
  status: 'STAGED' | 'LOADING' | 'IN_TRANSIT' | 'DELIVERED';
}

export interface RegisterCarrierDto {
  carrierCode: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email?: string;
  fleetType: string;
  ratingScore?: number;
}
