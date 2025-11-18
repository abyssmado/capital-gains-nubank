export function toNumber(value: unknown): number {
  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) {
    throw new TypeError(`Invalid number value: ${value}`);
  }
  return numberValue;
}
