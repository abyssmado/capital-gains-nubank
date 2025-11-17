import { toNumber } from "../../../../shared/utils";
import { Operation } from "../../../domain";

export function transformOperationsPipe(operations: any[]): Operation[] {
  return operations.map((op) => ({
    operation: op.operation,
    unitCost: toNumber(op["unit-cost"]),
    quantity: toNumber(op.quantity),
  }));
}
