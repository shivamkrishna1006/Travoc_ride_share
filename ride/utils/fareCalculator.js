// Calculate fare based on distance and ride type
function calculateFare(pickupCoordinates, dropoffCoordinates, rideType = 'economy', distance = null) {
  // Calculate distance using Haversine formula if not provided
  if (!distance) {
    distance = calculateDistance(pickupCoordinates, dropoffCoordinates);
  }

  const baseFare = {
    economy: 50,
    premium: 100,
    xl: 80,
  };

  const perKmRate = {
    economy: 10,
    premium: 15,
    xl: 12,
  };

  const perMinuteRate = {
    economy: 2,
    premium: 3,
    xl: 2.5,
  };

  const type = rideType.toLowerCase();
  const base = baseFare[type] || 50;
  const kmCharge = (distance / 1000) * (perKmRate[type] || 10);

  // Estimate time as 1 minute per km (average city speed)
  const estimatedMinutes = Math.ceil(distance / 1000);
  const timeCharge = estimatedMinutes * (perMinuteRate[type] || 2);

  let totalFare = base + kmCharge + timeCharge;

  // Apply surge pricing during peak hours (e.g., 8-10 AM, 6-8 PM)
  const hour = new Date().getHours();
  if ((hour >= 8 && hour < 10) || (hour >= 18 && hour < 20)) {
    totalFare *= 1.5;
  }

  return Math.round(totalFare);
}

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(coord1, coord2) {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;

  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

module.exports = {
  calculateFare,
  calculateDistance,
};
