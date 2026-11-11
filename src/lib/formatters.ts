export function formatArs(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatUnitCost(totalPrice: number, minUnits: number, maxUnits: number): string {
  const avgUnits = (minUnits + maxUnits) / 2;
  const costPerUnit = Math.round(totalPrice / avgUnits);
  return formatArs(costPerUnit);
}
