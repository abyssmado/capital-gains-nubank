import { transformOperationsPipe } from "../transform";

describe("transformOperationsPipe", () => {
  test("converts fields to expected Operation shape", () => {
    const input = [{ operation: "buy", "unit-cost": "10", quantity: "2" } as any];
    const res = transformOperationsPipe(input);
    expect(res[0].unitCost).toBe(10);
    expect(res[0].quantity).toBe(2);
  });
});
