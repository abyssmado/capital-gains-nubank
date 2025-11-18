export interface Operation {
  operation: OperationType;
  quantity: number;
  "unit-cost": number;
}

export type OperationType = "buy" | "sell";
