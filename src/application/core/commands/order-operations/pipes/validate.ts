import { InvalidArgumentError } from "commander";
import { Operation } from "../../../domain";

export function validateOperationPipe(data: Operation[]): Operation[] {
  if (!Array.isArray(data)) {
    throw new InvalidArgumentError("The provided data is not an array");
  }
  return data;
}
