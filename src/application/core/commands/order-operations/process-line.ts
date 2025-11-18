import type { Operation } from "../../domain";

import { parseOperationPipe, transformOperationsPipe, validateOperationPipe } from "./pipes";

import { handleOperations } from ".";

export type Stage<I, O> = (input: I) => O;

const pipeline: [
  Stage<string, Operation[]>,
  Stage<Operation[], Operation[]>,
  Stage<any[], Operation[]>,
] = [parseOperationPipe, validateOperationPipe, transformOperationsPipe];

export function processLine(line: string): void {
  try {
    let acc: string | Operation[] = line;

    for (const fn of pipeline) {
      acc = fn(acc as any);
    }

    const result = acc as Operation[];
    handleOperations(result);
  } catch (err) {
    console.log("Error:", (err as Error).message);
  }
}

export default processLine;
