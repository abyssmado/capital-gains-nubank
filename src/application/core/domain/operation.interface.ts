export interface Operation {
  operation: OperationType;
  quantity: number;
  unitCost: number;
}

export type OperationType = "buy" | "sell";
