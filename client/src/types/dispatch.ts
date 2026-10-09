export type ShipmentStatus =
  | 'STAGED'
  | 'LOADING'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'EXCEPTION';

export type ReturnDisposition =
  | 'RESTOCK'
  | 'REWORK'
  | 'SCRAP'
  | 'UNDER_INSPECTION';

export type PickingStatus =
  | 'QUEUED'
  | 'PICKING'
  | 'STAGED'
  | 'LOADED'
  | 'CANCELLED';

export type BarcodeType =
  | 'GS1_128'
  | 'CODE_128'
  | 'QR_CODE'
  | 'DATA_MATRIX';

export interface FinishedGoodsBayItem {
  id: string;
  bayCode: string;
  zone: string;
  aisle: string;
  rack: string;
  shelf: string;
  capacityUnits: number;
  occupiedUnits: number;
  itemCode?: string;
  itemName?: string;
  lotBatchNumber?: string;
  unitValuation: number;
  isReserved: boolean;
}

export interface BarcodeLabelItem {
  id: string;
  barcodeString: string;
  symbology: BarcodeType;
  serialNumber: string;
  skuCode: string;
  batchNumber: string;
  qrPayload?: Record<string, any>;
  printedAt: string;
  isApplied: boolean;
}

export interface PackedCartonItem {
  id: string;
  cartonNumber: string;
  salesOrderRef?: string;
  itemCode: string;
  itemName: string;
  lotBatchNumber: string;
  quantityUnits: number;
  grossWeightKg: number;
  dimensions: string;
  isSealed: boolean;
  sealedBy: string;
  packedAt: string;
  stagingBay?: string;
  barcodeLabel?: BarcodeLabelItem;
}

export interface PickItemLine {
  itemCode: string;
  itemName: string;
  requestedQty: number;
  pickedQty: number;
  sourceBay: string;
  lotNumber: string;
}

export interface SalesOrderFulfillmentItem {
  id: string;
  pickListNumber: string;
  salesOrderNumber: string;
  customerName: string;
  assignedPicker: string;
  status: PickingStatus;
  stagingBay: string;
  targetDeliveryDate: string;
  itemsToPick: PickItemLine[];
  pickedAt?: string;
  verifiedBy?: string;
  createdAt: string;
}

export interface DispatchShipmentItem {
  id: string;
  shipmentNumber: string;
  deliveryChallanNumber: string;
  salesOrderNumber: string;
  customerName: string;
  carrierName: string;
  vehicleNumber: string;
  driverName: string;
  driverContact: string;
  gatePassNumber: string;
  sealNumber: string;
  status: ShipmentStatus;
  totalWeightKg: number;
  cartonsCount: number;
  loadedAt?: string;
  dispatchedAt?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  loadedBy: string;
  createdAt: string;
}

export interface CarrierDetailItem {
  id: string;
  carrierCode: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email?: string;
  fleetType: string;
  ratingScore: number;
  isActive: boolean;
}

export interface CustomerReturnItem {
  id: string;
  rmaNumber: string;
  salesOrderRef: string;
  deliveryChallanRef?: string;
  customerName: string;
  itemCode: string;
  itemName: string;
  returnedQuantity: number;
  returnReason: string;
  disposition: ReturnDisposition;
  replacementOrderRef?: string;
  receivedAt: string;
  inspectedBy: string;
  resolutionNotes?: string;
}

export interface TransitDamageLogItem {
  id: string;
  damageClaimNumber: string;
  shipmentNumber: string;
  carrierName: string;
  itemCode: string;
  damagedQuantity: number;
  lossAmount: number;
  carrierLiabilityAccepted: boolean;
  insuranceClaimNumber?: string;
  damageDescription: string;
  loggedBy: string;
  createdAt: string;
}
