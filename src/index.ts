import { handleOperations, startLoop } from "./application/core/commands/order-operations";
import {
  parseOperationPipe,
  transformOperationsPipe,
  validateOperationPipe,
} from "./application/core/commands/order-operations/pipes";
import { Operation } from "./application/core/domain";

export type Stage<I, O> = (input: I) => O;

const pipeline: [
  Stage<string, Operation[]>,
  Stage<Operation[], Operation[]>,
  Stage<any[], Operation[]>,
] = [parseOperationPipe, validateOperationPipe, transformOperationsPipe];

function processLine(line: string): void {
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

startLoop(processLine);
