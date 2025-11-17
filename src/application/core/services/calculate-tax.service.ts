import type { Operation, Tax } from "../domain";
import { TAX_RATE, TAX_FREE_THRESHOLD } from "../../shared/constants";

export class CalculateTaxService {
  private quantityHeld = 0;
  private weightedAverage = 0;
  private accumulatedLoss = 0;

  public calculateTaxes(operations: Operation[]): Tax[] {
    return operations.map((op) => {
      if (op.operation === "buy") {
        this.handleBuy(op);
        return { tax: 0 };
      } else {
        return { tax: this.handleSell(op) };
      }
    });
  }

  private handleBuy(op: Operation): void {
    this.weightedAverage =
      (this.quantityHeld * this.weightedAverage + op.quantity * op.unitCost) /
      (this.quantityHeld + op.quantity);
    this.quantityHeld += op.quantity;
  }

  private handleSell(op: Operation): number {
    if (op.quantity > this.quantityHeld) {
      throw new Error("Trying to sell more than held");
    }

    const totalValue = op.quantity * op.unitCost;
    let profit = (op.unitCost - this.weightedAverage) * op.quantity;

    if (totalValue <= TAX_FREE_THRESHOLD) {
      if (profit < 0) {
        this.accumulatedLoss += -profit;
      }

      this.quantityHeld -= op.quantity;
      return 0;
    }

    if (profit > 0 && this.accumulatedLoss > 0) {
      const deduction = Math.min(profit, this.accumulatedLoss);
      profit -= deduction;
      this.accumulatedLoss -= deduction;
    }

    if (profit < 0) {
      this.accumulatedLoss += -profit;
      profit = 0;
    }

    this.quantityHeld -= op.quantity;
    return profit * TAX_RATE;
  }
}
