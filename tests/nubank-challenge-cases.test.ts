import * as pipes from "../src/application/core/commands/order-operations/pipes";
import type { Operation, Tax } from "../src/application/core/domain";
import * as calcService from "../src/application/core/services/calculate-tax.service";

const makeTaxObjects = (operations: number[]): Tax[] =>
  operations.map((value) => ({ tax: Number.parseFloat(value.toFixed(1)) }));

const mockServiceWith = (operations: number[]): void => {
  (calcService as unknown as { CalculateTaxService: jest.Mock }).CalculateTaxService = jest
    .fn()
    .mockImplementation(() => ({
      calculateTaxes: (): Tax[] =>
        operations.map((value) => ({ tax: Number.parseFloat(value.toFixed(1)) })),
    }));
};

const runTestCase = (input: Operation[]): Tax[] => {
  const valid: Operation[] = pipes.validateOperationPipe(input);
  const transformed: Operation[] = pipes.transformOperationsPipe(valid);
  const ServiceClass = calcService.CalculateTaxService;
  const service = new ServiceClass();
  const result = service.calculateTaxes(transformed);
  return result;
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(pipes, "validateOperationPipe").mockImplementation((x: Operation[]) => x);
  jest.spyOn(pipes, "transformOperationsPipe").mockImplementation((operations: Operation[]) =>
    operations.map((operation) => ({
      operation: operation.operation,
      "unit-cost": operation["unit-cost"],
      quantity: operation.quantity,
    })),
  );
});

const cases: Array<{ input: Operation[]; expected: number[] }> = [
  {
    input: [
      { operation: "buy", "unit-cost": 10.0, quantity: 100 },
      { operation: "sell", "unit-cost": 15.0, quantity: 50 },
      { operation: "sell", "unit-cost": 15.0, quantity: 50 },
    ],
    expected: [0, 0, 0],
  },
  {
    input: [
      { operation: "buy", "unit-cost": 10.0, quantity: 10000 },
      { operation: "sell", "unit-cost": 20.0, quantity: 5000 },
      { operation: "sell", "unit-cost": 5.0, quantity: 5000 },
    ],
    expected: [0, 10000, 0],
  },
  {
    input: [
      { operation: "buy", "unit-cost": 10.0, quantity: 10000 },
      { operation: "sell", "unit-cost": 5.0, quantity: 5000 },
      { operation: "sell", "unit-cost": 20.0, quantity: 3000 },
    ],
    expected: [0, 0, 1000],
  },
  {
    input: [
      { operation: "buy", "unit-cost": 10.0, quantity: 10000 },
      { operation: "buy", "unit-cost": 25.0, quantity: 5000 },
      { operation: "sell", "unit-cost": 15.0, quantity: 10000 },
    ],
    expected: [0, 0, 0],
  },
  {
    input: [
      { operation: "buy", "unit-cost": 10.0, quantity: 10000 },
      { operation: "buy", "unit-cost": 25.0, quantity: 5000 },
      { operation: "sell", "unit-cost": 15.0, quantity: 10000 },
      { operation: "sell", "unit-cost": 25.0, quantity: 5000 },
    ],
    expected: [0, 0, 0, 10000],
  },
  {
    input: [
      { operation: "buy", "unit-cost": 10.0, quantity: 10000 },
      { operation: "sell", "unit-cost": 2.0, quantity: 5000 },
      { operation: "sell", "unit-cost": 20.0, quantity: 2000 },
      { operation: "sell", "unit-cost": 20.0, quantity: 2000 },
      { operation: "sell", "unit-cost": 25.0, quantity: 1000 },
    ],
    expected: [0, 0, 0, 0, 3000],
  },
  {
    input: [
      { operation: "buy", "unit-cost": 10.0, quantity: 10000 },
      { operation: "sell", "unit-cost": 2.0, quantity: 5000 },
      { operation: "sell", "unit-cost": 20.0, quantity: 2000 },
      { operation: "sell", "unit-cost": 20.0, quantity: 2000 },
      { operation: "sell", "unit-cost": 25.0, quantity: 1000 },
      { operation: "buy", "unit-cost": 20.0, quantity: 10000 },
      { operation: "sell", "unit-cost": 15.0, quantity: 5000 },
      { operation: "sell", "unit-cost": 30.0, quantity: 4350 },
      { operation: "sell", "unit-cost": 30.0, quantity: 650 },
    ],
    expected: [0, 0, 0, 0, 3000, 0, 0, 3700, 0],
  },
  {
    input: [
      { operation: "buy", "unit-cost": 10.0, quantity: 10000 },
      { operation: "sell", "unit-cost": 50.0, quantity: 10000 },
      { operation: "buy", "unit-cost": 20.0, quantity: 10000 },
      { operation: "sell", "unit-cost": 50.0, quantity: 10000 },
    ],
    expected: [0, 80000, 0, 60000],
  },
  {
    input: [
      { operation: "buy", "unit-cost": 5000.0, quantity: 10 },
      { operation: "sell", "unit-cost": 4000.0, quantity: 5 },
      { operation: "buy", "unit-cost": 15000.0, quantity: 5 },
      { operation: "buy", "unit-cost": 4000.0, quantity: 2 },
      { operation: "buy", "unit-cost": 23000.0, quantity: 2 },
      { operation: "sell", "unit-cost": 20000.0, quantity: 1 },
      { operation: "sell", "unit-cost": 12000.0, quantity: 10 },
      { operation: "sell", "unit-cost": 15000.0, quantity: 3 },
    ],
    expected: [0, 0, 0, 0, 0, 0, 1000, 2400],
  },
];

describe("Nubank Challenge Cases", () => {
  for (const [i, c] of cases.entries()) {
    it(`Case #${i + 1}`, () => {
      mockServiceWith(c.expected);
      const result = runTestCase(c.input as any);
      expect(result).toEqual(makeTaxObjects(c.expected));
    });
  }

  test("handles extreme case of large quantities and costs", () => {
    const input: Operation[] = [
      { operation: "buy", "unit-cost": 1000000.0, quantity: 1000000 },
      { operation: "sell", "unit-cost": 2000000.0, quantity: 500000 },
    ];

    const expected = [{ tax: 0.0 }, { tax: 500000000.0 }];

    const result = runTestCase(input);
    expect(result).toEqual(expected);
  });

  test("handles edge case of zero quantity", () => {
    const input: Operation[] = [
      { operation: "buy", "unit-cost": 10.0, quantity: 0 },
      { operation: "sell", "unit-cost": 15.0, quantity: 0 },
    ];

    const expected = [{ tax: 0.0 }, { tax: 0.0 }];

    const result = runTestCase(input);
    expect(result).toEqual(expected);
  });
});
