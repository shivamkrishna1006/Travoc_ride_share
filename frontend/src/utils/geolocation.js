// Haversine formula - calculate distance between two coordinates
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Calculate bearing (direction) between two points
export const calculateBearing = (lat1, lon1, lat2, lon2) => {
  const dLon = lon2 - lon1
  const x = Math.sin(dLon) * Math.cos(lat2)
  const y = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon)
  return Math.atan2(x, y) * (180 / Math.PI)
}

// Normalize bearing to 0-360
export const normalizeBearing = (bearing) => {
  return ((bearing % 360) + 360) % 360
}

// Get cardinal direction from bearing
export const getCardinalDirection = (bearing) => {
  const directions = [
    'North',
    'NNE',
    'NE',
    'ENE',
    'East',
    'ESE',
    'SE',
    'SSE',
    'South',
    'SSW',
    'SW',
    'WSW',
    'West',
    'WNW',
    'NW',
    'NNW',
  ]
  const index = Math.round(bearing / 22.5) % 16
  return directions[index]
}

// Get bounding box for a point with radius
export const getBoundingBox = (lat, lon, radiusKm) => {
  const latOffset = (radiusKm / 111.2) // 1 degree latitude ≈ 111.2 km
  const lonOffset = (radiusKm / (111.2 * Math.cos((lat * Math.PI) / 180)))

  return {
    north: lat + latOffset,
    south: lat - latOffset,
    east: lon + lonOffset,
    west: lon - lonOffset,
  }
}

// Check if point is within bounding box
export const isPointInBounds = (lat, lon, bounds) => {
  return (
    lat >= bounds.south &&
    lat <= bounds.north &&
    lon >= bounds.west &&
    lon <= bounds.east
  )
}

// Get ETA based on distance and average speed
export const calculateETA = (distanceKm, avgSpeedKmh = 40) => {
  const minutes = Math.round((distanceKm / avgSpeedKmh) * 60)
  return Math.max(1, minutes)
}

// Interpolate location between two points
export const interpolateLocation = (
  lat1,
  lon1,
  lat2,
  lon2,
  fraction
) => {
  return {
    lat: lat1 + (lat2 - lat1) * fraction,
    lon: lon1 + (lon2 - lon1) * fraction,
  }
}

// Get random location within bounds (for testing)
export const getRandomLocationInBounds = (bounds) => {
  const randomLat = bounds.south + Math.random() * (bounds.north - bounds.south)
  const randomLon = bounds.west + Math.random() * (bounds.east - bounds.west)
  return { lat: randomLat, lon: randomLon }
}
