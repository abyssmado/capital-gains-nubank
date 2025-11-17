export function toNumber(value: any): number {
  const num = Number(value);
  if (Number.isNaN(num)) throw new Error("Error while converting to number");
  return num;
}
