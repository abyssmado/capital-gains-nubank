import { toNumber } from "../../../../shared/utils";
import type { Operation } from "../../../domain";

export function transformOperationsPipe(operations: any[]): Operation[] {
  return operations.map((operation) => ({
    operation: operation.operation,
    unitCost: toNumber(operation["unit-cost"]),
    quantity: toNumber(operation.quantity),
  }));
}
