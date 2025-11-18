export function toNumber(value: unknown): number {
  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) throw new Error("Error while converting to number");
  return numberValue;
}
