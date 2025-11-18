import { toNumber } from "../../../../shared/utils";
import type { Operation } from "../../../domain";

export function transformOperationsPipe(operations: Operation[]): Operation[] {
  return operations.map((operation) => ({
    operation: operation.operation,
    "unit-cost": toNumber(operation["unit-cost"]),
    quantity: toNumber(operation.quantity),
  }));
}
