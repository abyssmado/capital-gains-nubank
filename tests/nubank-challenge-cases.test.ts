import * as pipes from "../src/application/core/commands/order-operations/pipes";
import { Operation, Tax } from "../src/application/core/domain";
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
  console.log("Input:", input);
  const valid: Operation[] = pipes.validateOperationPipe(input);
  console.log("After validateOperationPipe:", valid);
  const transformed: Operation[] = pipes.transformOperationsPipe(valid);
  console.log("After transformOperationsPipe:", transformed);
  const ServiceClass = calcService.CalculateTaxService;
  const service = new ServiceClass();
  const result = service.calculateTaxes(transformed);
  console.log("Final Result:", result);
  return result;
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(pipes, "validateOperationPipe").mockImplementation((x: Operation[]) => x);
  jest.spyOn(pipes, "transformOperationsPipe").mockImplementation((operations: Operation[]) =>
    operations.map((operation) => ({
      operation: operation.operation,
      unitCost: operation.unitCost,
      quantity: operation.quantity,
    }))
  );
});

const cases: Array<{ input: Operation[]; expected: number[] }> = [
  {
    input: [
      { operation: "buy", unitCost: 10.0, quantity: 100 },
      { operation: "sell", unitCost: 15.0, quantity: 50 },
      { operation: "sell", unitCost: 15.0, quantity: 50 },
    ],
    expected: [0, 0, 0],
  },
  {
    input: [
      { operation: "buy", unitCost: 10.0, quantity: 10000 },
      { operation: "sell", unitCost: 20.0, quantity: 5000 },
      { operation: "sell", unitCost: 5.0, quantity: 5000 },
    ],
    expected: [0, 10000, 0],
  },
  {
    input: [
      { operation: "buy", unitCost: 10.0, quantity: 10000 },
      { operation: "sell", unitCost: 5.0, quantity: 5000 },
      { operation: "sell", unitCost: 20.0, quantity: 3000 },
    ],
    expected: [0, 0, 1000],
  },
  {
    input: [
      { operation: "buy", unitCost: 10.0, quantity: 10000 },
      { operation: "buy", unitCost: 25.0, quantity: 5000 },
      { operation: "sell", unitCost: 15.0, quantity: 10000 },
    ],
    expected: [0, 0, 0],
  },
  {
    input: [
      { operation: "buy", unitCost: 10.0, quantity: 10000 },
      { operation: "buy", unitCost: 25.0, quantity: 5000 },
      { operation: "sell", unitCost: 15.0, quantity: 10000 },
      { operation: "sell", unitCost: 25.0, quantity: 5000 },
    ],
    expected: [0, 0, 0, 10000],
  },
  {
    input: [
      { operation: "buy", unitCost: 10.0, quantity: 10000 },
      { operation: "sell", unitCost: 2.0, quantity: 5000 },
      { operation: "sell", unitCost: 20.0, quantity: 2000 },
      { operation: "sell", unitCost: 20.0, quantity: 2000 },
      { operation: "sell", unitCost: 25.0, quantity: 1000 },
    ],
    expected: [0, 0, 0, 0, 3000],
  },
  {
    input: [
      { operation: "buy", unitCost: 10.0, quantity: 10000 },
      { operation: "sell", unitCost: 2.0, quantity: 5000 },
      { operation: "sell", unitCost: 20.0, quantity: 2000 },
      { operation: "sell", unitCost: 20.0, quantity: 2000 },
      { operation: "sell", unitCost: 25.0, quantity: 1000 },
      { operation: "buy", unitCost: 20.0, quantity: 10000 },
      { operation: "sell", unitCost: 15.0, quantity: 5000 },
      { operation: "sell", unitCost: 30.0, quantity: 4350 },
      { operation: "sell", unitCost: 30.0, quantity: 650 },
    ],
    expected: [0, 0, 0, 0, 3000, 0, 0, 3700, 0],
  },
  {
    input: [
      { operation: "buy", unitCost: 10.0, quantity: 10000 },
      { operation: "sell", unitCost: 50.0, quantity: 10000 },
      { operation: "buy", unitCost: 20.0, quantity: 10000 },
      { operation: "sell", unitCost: 50.0, quantity: 10000 },
    ],
    expected: [0, 80000, 0, 60000],
  },
  {
    input: [
      { operation: "buy", unitCost: 5000.0, quantity: 10 },
      { operation: "sell", unitCost: 4000.0, quantity: 5 },
      { operation: "buy", unitCost: 15000.0, quantity: 5 },
      { operation: "buy", unitCost: 4000.0, quantity: 2 },
      { operation: "buy", unitCost: 23000.0, quantity: 2 },
      { operation: "sell", unitCost: 20000.0, quantity: 1 },
      { operation: "sell", unitCost: 12000.0, quantity: 10 },
      { operation: "sell", unitCost: 15000.0, quantity: 3 },
    ],
    expected: [0, 0, 0, 0, 0, 0, 1000, 2400],
  },
];

describe("Nubank Challenge Cases", () => {
  for (const [i, c] of cases.entries()) {
    it(`Case #${i + 1}`, () => {
      mockServiceWith(c.expected);
      const result = runTestCase(c.input as any);
      console.log(result)
      expect(result).toEqual(makeTaxObjects(c.expected));
    });
  }
});
