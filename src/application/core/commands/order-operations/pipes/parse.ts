import type { Operation } from "../../../domain";

export function parseOperationPipe(input: string): Operation[] {
  return JSON.parse(input) as Operation[];
}
