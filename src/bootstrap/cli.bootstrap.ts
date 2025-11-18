import { createProcessCommand, processLine } from "../application/core/commands/order-operations/";
import { startLoop } from "../application/core/commands/order-operations/loop";
import { CliProvider } from "../application/shared/providers/cli/cli.provider";

export function runCli(): void {
  const cli = new CliProvider();

  cli.registerCommand(createProcessCommand());

  const userArgs = process.argv.slice(2);
  if (!userArgs || userArgs.length === 0) {
    startLoop(processLine);
    return;
  }

  cli.run();
}
