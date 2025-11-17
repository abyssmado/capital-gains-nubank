import { Command } from "commander";
import { CliProvider } from "../cli.provider";

describe("CliProvider", () => {
  let addSpy: jest.SpyInstance;
  let parseSpy: jest.SpyInstance;

  beforeEach(() => {
    addSpy = jest.spyOn(Command.prototype as any, "addCommand").mockImplementation(() => {});
    parseSpy = jest.spyOn(Command.prototype as any, "parse").mockImplementation(() => {});
  });

  afterEach(() => {
    addSpy.mockRestore();
    parseSpy.mockRestore();
  });

  test("registerCommand calls addCommand on internal cli client", () => {
    const provider = new CliProvider();
    const cmd = new Command();
    provider.registerCommand(cmd);
    expect(addSpy).toHaveBeenCalledWith(cmd);
  });

  test("registerCommands calls addCommand for each provided command", () => {
    const provider = new CliProvider();
    const command1 = new Command();
    const command2 = new Command();
    provider.registerCommands([command1, command2]);
    expect(addSpy).toHaveBeenCalledTimes(2);
    expect(addSpy).toHaveBeenCalledWith(command1);
    expect(addSpy).toHaveBeenCalledWith(command2);
  });

  test("run calls parse on the internal cli client", () => {
    const provider = new CliProvider();
    provider.run();
    expect(parseSpy).toHaveBeenCalled();
  });
});
