import type { Operation } from "../../domain";
import { CalculateTaxService } from "../calculate-tax.service";

describe("CalculateTaxService", () => {
  test("calculates taxes for simple buy/sell sequence", () => {
    const service = new CalculateTaxService();
    const operationsMock: Operation[] = [
      { operation: "buy", "unit-cost": 10, quantity: 10000 },
      { operation: "sell", "unit-cost": 20, quantity: 5000 },
    ];

    const taxes = service.calculateTaxes(operationsMock).map((value) => value.tax);
    expect(taxes).toEqual([0, 10000]);
  });

  test("applies accumulated losses correctly across multiple sales", () => {
    const service = new CalculateTaxService();
    const operationsMock: Operation[] = [
      { operation: "buy", "unit-cost": 10, quantity: 10000 },
      { operation: "sell", "unit-cost": 2, quantity: 5000 },
      { operation: "sell", "unit-cost": 20, quantity: 2000 },
      { operation: "sell", "unit-cost": 20, quantity: 2000 },
      { operation: "sell", "unit-cost": 25, quantity: 1000 },
    ];

    const taxes = service.calculateTaxes(operationsMock).map((value) => value.tax);
    expect(taxes).toEqual([0, 0, 0, 0, 3000]);
  });
});
