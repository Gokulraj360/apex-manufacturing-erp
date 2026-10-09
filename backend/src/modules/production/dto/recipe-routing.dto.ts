export interface BomComponentItemDto {
  partNumber: string;
  description: string;
  quantityRequired: number;
  uom: string;
  unitCost: number;
}

export interface AssemblyRoutingStepDto {
  stepNumber: number;
  stationName: string;
  instruction: string;
  cycleTimeMinutes: number;
  toolingRequired?: string;
  qualityCheckpoints?: Array<{ checkpoint: string; specTolerance: string; isMandatory: boolean }>;
}

export interface CreateBomDto {
  sku: string;
  name: string;
  version?: string;
  description?: string;
  components: BomComponentItemDto[];
  blueprintUrl?: string;
  blueprintSpecifications?: Record<string, any>;
  routings?: AssemblyRoutingStepDto[];
}
