import { sqftToSqm, sqftToGuntha, sqftToAcre } from "@/lib/area";

export default function AreaConversion({ area }: { area: number }) {
  return (
    <div
      style={{
        marginTop: 20,
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 16,
        padding: 18,
      }}
    >
      <h3
        style={{
          marginBottom: 12,
          fontSize: 16,
          fontWeight: 700,
        }}
      >
        Area Conversion
      </h3>

      <div>Sq Meter: {sqftToSqm(area)}</div>

      <div>Guntha: {sqftToGuntha(area)}</div>

      <div>Acre: {sqftToAcre(area)}</div>
    </div>
  );
}
