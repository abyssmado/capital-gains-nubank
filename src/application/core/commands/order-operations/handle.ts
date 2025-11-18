import { FileProvider } from "../../../shared/providers/file/file.provider";
import type { Operation } from "../../domain";
import { CalculateTaxService } from "../../services/calculate-tax.service";

export const handleOperations = (arr: Operation[]): void => {
  const calculateTaxService = new CalculateTaxService();
  const calculatedTaxes = calculateTaxService.calculateTaxes(arr);

  const formattedTaxes = calculatedTaxes.map((t) => `{ "tax": ${t.tax.toFixed(1)} }`).join(", ");
  console.log(`\n[${formattedTaxes}]\n`);

  const fileProvider = new FileProvider();
  const outPath = "./stdout/output.txt";

  const lineToAppend =
    "[" + calculatedTaxes.map((t) => `{ "tax": ${t.tax.toFixed(1)} }`).join(", ") + "]";

  try {
    let existing = "";

    if (fileProvider.fileExists(outPath)) {
      existing = fileProvider.readFile(outPath);
    } else {
      console.log("File does not exist. Creating new output file.");
      fileProvider.createFile(outPath);
    }

    const newContent =
      (existing.length > 0 ? existing.trimEnd() + "\r\n" : "") + lineToAppend + "\r\n";
    fileProvider.writeFile(outPath, newContent);
  } catch (err) {
    console.error("Erro ao persistir resultado:", (err as Error).message);
  }
};
