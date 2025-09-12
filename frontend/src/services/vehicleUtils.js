export function detectVehicleType(vehicleNo) {
  if (!vehicleNo) return "Unknown";

  if (/^[A-Z]{2}-\d{4}$/i.test(vehicleNo)) return "Car / Van";
  if (/^[A-Z]{2}-\d{3}$/i.test(vehicleNo)) return "Motorbike";
  if (/^[A-Z]{2}-[A-Z]{2}-\d{4}$/i.test(vehicleNo)) return "Truck / Lorry";
  if (/^WP|NW|CP|EP|NC/i.test(vehicleNo)) return "Government Vehicle";

  return "Other";
}
