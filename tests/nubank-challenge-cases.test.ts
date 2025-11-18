import { describe, it, expect } from "@jest/globals";

import {
  validateOperationPipe,
  transformOperationsPipe,
} from "../src/application/core/commands/order-operations/pipes";
import { CalculateTaxService } from "../src/application/core/services/calculate-tax.service";

function runTestCase(
  input: { operation: string; "unit-cost": number; quantity: number }[],
): number[] {
  const valid = validateOperationPipe(input as any);
  const transformed = transformOperationsPipe(valid);
  const service = new CalculateTaxService();
  return service.calculateTaxes(transformed).map((t) => t.tax);
}

describe("Nubank Challenge Cases", () => {
  it("Case #1", async () => {
    const input = [
      { operation: "buy", "unit-cost": 10.0, quantity: 100 },
      { operation: "sell", "unit-cost": 15.0, quantity: 50 },
      { operation: "sell", "unit-cost": 15.0, quantity: 50 },
    ];
    const result = runTestCase(input);
    expect(result).toEqual([0, 0, 0]);
  });

  it("Case #2", async () => {
    const input = [
      { operation: "buy", "unit-cost": 10.0, quantity: 10000 },
      { operation: "sell", "unit-cost": 20.0, quantity: 5000 },
      { operation: "sell", "unit-cost": 5.0, quantity: 5000 },
    ];
    const result = runTestCase(input);
    expect(result).toEqual([0, 10000, 0]);
  });

  it("Case #3", async () => {
    const input = [
      { operation: "buy", "unit-cost": 10.0, quantity: 10000 },
      { operation: "sell", "unit-cost": 5.0, quantity: 5000 },
      { operation: "sell", "unit-cost": 20.0, quantity: 3000 },
    ];
    const result = runTestCase(input);
    expect(result).toEqual([0, 0, 1000]);
  });

  it("Case #4", async () => {
    const input = [
      { operation: "buy", "unit-cost": 10.0, quantity: 10000 },
      { operation: "buy", "unit-cost": 25.0, quantity: 5000 },
      { operation: "sell", "unit-cost": 15.0, quantity: 10000 },
    ];
    const result = runTestCase(input);
    expect(result).toEqual([0, 0, 0]);
  });

  it("Case #5", async () => {
    const input = [
      { operation: "buy", "unit-cost": 10.0, quantity: 10000 },
      { operation: "buy", "unit-cost": 25.0, quantity: 5000 },
      { operation: "sell", "unit-cost": 15.0, quantity: 10000 },
      { operation: "sell", "unit-cost": 25.0, quantity: 5000 },
    ];
    const result = runTestCase(input);
    expect(result).toEqual([0, 0, 0, 10000]);
  });

  it("Case #6", async () => {
    const input = [
      { operation: "buy", "unit-cost": 10.0, quantity: 10000 },
      { operation: "sell", "unit-cost": 2.0, quantity: 5000 },
      { operation: "sell", "unit-cost": 20.0, quantity: 2000 },
      { operation: "sell", "unit-cost": 20.0, quantity: 2000 },
      { operation: "sell", "unit-cost": 25.0, quantity: 1000 },
    ];
    const result = runTestCase(input);
    expect(result).toEqual([0, 0, 0, 0, 3000]);
  });

  it("Case #7", async () => {
    const input = [
      { operation: "buy", "unit-cost": 10.0, quantity: 10000 },
      { operation: "sell", "unit-cost": 2.0, quantity: 5000 },
      { operation: "sell", "unit-cost": 20.0, quantity: 2000 },
      { operation: "sell", "unit-cost": 20.0, quantity: 2000 },
      { operation: "sell", "unit-cost": 25.0, quantity: 1000 },
      { operation: "buy", "unit-cost": 20.0, quantity: 10000 },
      { operation: "sell", "unit-cost": 15.0, quantity: 5000 },
      { operation: "sell", "unit-cost": 30.0, quantity: 4350 },
      { operation: "sell", "unit-cost": 30.0, quantity: 650 },
    ];
    const result = runTestCase(input);
    expect(result).toEqual([0, 0, 0, 0, 3000, 0, 0, 3700, 0]);
  });

  it("Case #8", async () => {
    const input = [
      { operation: "buy", "unit-cost": 10.0, quantity: 10000 },
      { operation: "sell", "unit-cost": 50.0, quantity: 10000 },
      { operation: "buy", "unit-cost": 20.0, quantity: 10000 },
      { operation: "sell", "unit-cost": 50.0, quantity: 10000 },
    ];
    const result = runTestCase(input);
    expect(result).toEqual([0, 80000, 0, 60000]);
  });

  it("Case #9", async () => {
    const input = [
      { operation: "buy", "unit-cost": 5000.0, quantity: 10 },
      { operation: "sell", "unit-cost": 4000.0, quantity: 5 },
      { operation: "buy", "unit-cost": 15000.0, quantity: 5 },
      { operation: "buy", "unit-cost": 4000.0, quantity: 2 },
      { operation: "buy", "unit-cost": 23000.0, quantity: 2 },
      { operation: "sell", "unit-cost": 20000.0, quantity: 1 },
      { operation: "sell", "unit-cost": 12000.0, quantity: 10 },
      { operation: "sell", "unit-cost": 15000.0, quantity: 3 },
    ];
    const result = runTestCase(input);
    expect(result).toEqual([0, 0, 0, 0, 0, 0, 1000, 2400]);
  });
});
