export function parseCurrency(value: string): number {
  const normalized = value.replace(/[$,]/g, '').trim();
  const amount = Number(normalized);

  if (!normalized || !Number.isFinite(amount)) {
    throw new Error(`Invalid currency value: "${value}".`);
  }

  return amount;
}
