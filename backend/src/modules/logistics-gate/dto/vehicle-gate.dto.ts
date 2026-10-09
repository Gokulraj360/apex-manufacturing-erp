export interface CheckInVehicleDto {
  vehicleNumber: string;
  vehicleType: 'DELIVERY_TRUCK' | 'SUPPLIER_VEHICLE' | 'STAFF_VEHICLE' | 'VISITOR' | 'MAINTENANCE_VEHICLE';
  driverName: string;
  driverPhone: string;
  driverLicense?: string;
  purpose: string;
  destinationBay?: string;
  gateNumber: string;
  badgeNumber?: string;
  securityOfficer: string;
  remarks?: string;
}

export interface CheckOutVehicleDto {
  exitTime?: Date | string;
  remarks?: string;
}
