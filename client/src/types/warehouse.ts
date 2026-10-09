export type StockCategory =
  | 'RAW_MATERIAL'
  | 'WORK_IN_PROGRESS'
  | 'FINISHED_GOODS'
  | 'CONSUMABLE'
  | 'SPARE_PART';

export type ChallanStatus =
  | 'DRAFT'
  | 'PICKING'
  | 'PACKED'
  | 'DISPATCHED'
  | 'DELIVERED'
  | 'CANCELLED';

export type CycleCountStatus =
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'RECONCILED';

export interface WarehouseStockItem {
  id: string;
  itemCode: string;
  itemName: string;
  category: StockCategory;
  currentQuantity: number;
  reservedQuantity: number;
  reorderThreshold: number;
  reorderQuantity: number;
  unitOfMeasure: string;
  unitValuation: number;
  binLocationId?: string;
  binCode?: string;
  lotBatchNumber?: string;
  isBelowReorderThreshold: boolean;
}

export interface BinLocationItem {
  id: string;
  binCode: string;
  zone: string;
  aisle: string;
  rack: string;
  shelf: string;
  capacityMaxUnits: number;
  currentOccupancyUnits: number;
  isQuarantine: boolean;
}

export interface ReceivedLineItem {
  itemCode: string;
  itemName: string;
  quantityOrdered: number;
  quantityReceived: number;
  quantityAccepted: number;
  quantityRejected: number;
  uom: string;
  rejectionReason?: string;
}

export interface GrnItem {
  id: string;
  grnNumber: string;
  poNumber: string;
  supplierName: string;
  receivedDate: string;
  inspectedBy: string;
  inspectionPassed: boolean;
  itemsReceived: ReceivedLineItem[];
  storageBinCode?: string;
  vendorDeliveryChallan?: string;
  remarks?: string;
}

export interface DispatchedLineItem {
  itemCode: string;
  itemName: string;
  quantityDispatched: number;
  uom: string;
  serialLots?: string;
}

export interface DeliveryChallanItem {
  id: string;
  challanNumber: string;
  clientName: string;
  salesOrderRef: string;
  dispatchDate: string;
  carrierName: string;
  vehicleNumber?: string;
  trackingNumber: string;
  driverContact?: string;
  status: ChallanStatus;
  dispatchedItems: DispatchedLineItem[];
  totalWeightKg?: number;
  preparedBy: string;
  verifiedBy?: string;
}

export interface MaterialIssuanceItem {
  id: string;
  issuanceNumber: string;
  requisitionNumber: string;
  workOrderNumber: string;
  issuedTo: string;
  issuedBy: string;
  items: Array<{ itemCode: string; quantityIssued: number; sourceBinCode?: string; lotNumber?: string }>;
  issuedAt: string;
}

export interface CycleCountLineItem {
  itemCode: string;
  itemName: string;
  systemQuantity: number;
  physicalCount: number;
  variance: number;
  isReconciled: boolean;
}

export interface CycleCountItem {
  id: string;
  countNumber: string;
  zone: string;
  countDate: string;
  countedBy: string;
  status: CycleCountStatus;
  itemsCounted: CycleCountLineItem[];
  totalDiscrepancies: number;
  reconciledAt?: string;
  notes?: string;
}

export interface DamagedLogItem {
  id: string;
  itemCode: string;
  itemName: string;
  damagedQuantity: number;
  damageReason: string;
  financialLoss: number;
  reportedBy: string;
  isWrittenOff: boolean;
  binLocation?: string;
  createdAt: string;
}
