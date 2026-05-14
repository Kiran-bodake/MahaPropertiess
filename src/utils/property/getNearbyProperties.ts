export function getNearbyProperties(
  currentPincode: number,
  properties: any[],
  currentId: number,
  limit = 6,
) {
  return properties
    .filter((p) => {
      if (p.id === currentId) return false;

      return Math.abs(p.pincode - currentPincode) <= 5;
    })
    .sort((a, b) => {
      const distanceA = Math.abs(a.pincode - currentPincode);

      const distanceB = Math.abs(b.pincode - currentPincode);

      return distanceA - distanceB;
    })
    .slice(0, limit);
}
