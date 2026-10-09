export interface CreateDeliveryTripDto {
  carrierName: string;
  vehicleNumber: string;
  driverName: string;
  driverContact: string;
  routeOrigin: string;
  routeDestination: string;
  challanReferences: string[];
  estimatedArrival?: Date | string;
}

export interface UpdateDeliveryTripStatusDto {
  status: 'SCHEDULED' | 'DISPATCHED' | 'EN_ROUTE' | 'DELIVERED' | 'RETURNING' | 'COMPLETED';
  gpsCoordinates?: string;
  receiverName?: string;
  proofOfDeliveryRef?: string;
  deliveryNotes?: string;
}
