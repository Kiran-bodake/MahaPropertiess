export function sqftToSqm(area: number) {
  return (area * 0.092903).toFixed(2);
}

export function sqftToGuntha(area: number) {
  return (area / 1089).toFixed(2);
}

export function sqftToAcre(area: number) {
  return (area / 43560).toFixed(3);
}
