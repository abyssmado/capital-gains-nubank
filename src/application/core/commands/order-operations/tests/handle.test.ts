import fs from "node:fs";

import { handleOperations } from "../handle";

jest.mock("../../../services/calculate-tax.service", () => ({
  CalculateTaxService: jest.fn().mockImplementation(() => ({
    calculateTaxes: jest.fn().mockReturnValue([{ tax: 10000 }]),
  })),
}));

jest.mock("../../../../shared/providers/file/file.provider", () => ({
  FileProvider: jest.fn().mockImplementation(() => ({
    fileExists: jest.fn().mockReturnValue(false),
    createFile: jest.fn().mockImplementation(() => {}),
    readFile: jest.fn().mockImplementation(() => ""),
    writeFile: jest.fn().mockImplementation(() => {}),
  })),
}));

describe("handleOperations", () => {
  let unlinkSpy: jest.SpyInstance;
  beforeEach(() => {
    unlinkSpy = jest.spyOn(fs, "unlinkSync").mockImplementation(() => {});
  });

  afterEach(() => {
    unlinkSpy.mockRestore();
  });

  test("writes line to output file", () => {
    const operationsMock: any[] = [
      { operation: "buy", unitCost: 10, quantity: 10000 },
      { operation: "sell", unitCost: 20, quantity: 5000 },
    ];

    const spy = jest.spyOn(console, "log").mockImplementation(() => {});
    try {
      handleOperations(operationsMock as any);
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('{ "tax": 10000.0 }'));
    } finally {
      spy.mockRestore();
    }
  });
});
