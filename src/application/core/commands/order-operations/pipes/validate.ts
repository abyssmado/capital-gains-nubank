import { InvalidArgumentError } from "commander";

import type { Operation } from "../../../domain";

export function validateOperationPipe(operations: Operation[]): Operation[] {
  if (!Array.isArray(operations)) {
    throw new InvalidArgumentError("The provided data is not an array");
  }
  return operations.map((operation) => {
    return operation;
  });
}
