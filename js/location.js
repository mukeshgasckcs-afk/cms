// Geographical distance, route optimization, and pricing module
// Converted from location.py to JavaScript

/**
 * Calculates the Haversine distance between two coordinates in kilometers.
 * @param {[number, number]} coord1 [latitude, longitude]
 * @param {[number, number]} coord2 [latitude, longitude]
 * @returns {number} Distance in kilometers
 */
export function haversineDistance(coord1, coord2) {
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;
  const radius = 6371; // Earth's radius in kilometers

  const toRad = (angle) => (angle * Math.PI) / 180;
  const dlat = toRad(lat2 - lat1);
  const dlon = toRad(lon2 - lon1);

  const a =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dlon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return radius * c;
}

/**
 * Calculates total route distance along a sequence of cities.
 * @param {string[]} path Array of city names
 * @param {Record<string, {latitude: number, longitude: number}>} cityDict
 * @returns {number} Total distance in kilometers
 */
export function calculateTotalDistance(path, cityDict) {
  let totalDistance = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const city1 = path[i];
    const city2 = path[i + 1];
    if (cityDict[city1] && cityDict[city2]) {
      totalDistance += haversineDistance(
        [cityDict[city1].latitude, cityDict[city1].longitude],
        [cityDict[city2].latitude, cityDict[city2].longitude]
      );
    }
  }
  return totalDistance;
}

/**
 * Helper to generate permutations of an array.
 * @param {any[]} arr
 * @param {number} k
 * @returns {any[][]}
 */
function getPermutations(arr, k) {
  if (k === 0) return [[]];
  const results = [];
  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];
    const remaining = arr.slice(0, i).concat(arr.slice(i + 1));
    const subPerms = getPermutations(remaining, k - 1);
    for (const sub of subPerms) {
      results.push([current, ...sub]);
    }
  }
  return results;
}

/**
 * Finds the shortest path and distance between origin and destination cities
 * considering all possible permutations of intermediate cities.
 * @param {Record<string, {latitude: number, longitude: number}>} cityDict
 * @returns {{ shortestPath: string[], shortestDistance: number }}
 */
export function shortPath(cityDict) {
  const cities = Object.keys(cityDict);
  if (cities.length <= 1) {
    return { shortestPath: cities, shortestDistance: 0 };
  }
  const originCity = cities[0];
  const lastCity = cities[cities.length - 1];

  if (originCity === lastCity) {
    return { shortestPath: [originCity], shortestDistance: 0 };
  }

  const intermediateCities = cities.slice(1, -1);
  let shortestPath = [originCity, lastCity];
  let shortestDistance = calculateTotalDistance(shortestPath, cityDict);

  for (let numIntermediates = 0; numIntermediates <= intermediateCities.length; numIntermediates++) {
    const permutations = getPermutations(intermediateCities, numIntermediates);
    for (const perm of permutations) {
      const path = [originCity, ...perm, lastCity];
      const dist = calculateTotalDistance(path, cityDict);
      if (dist < shortestDistance) {
        shortestPath = path;
        shortestDistance = dist;
      }
    }
  }

  return { shortestPath, shortestDistance };
}

/**
 * Calculates total courier price based on distance, package count, dimensions, and preferences.
 * @param {number} shortestDistance
 * @param {number} packageNumber
 * @param {number} weight In grams
 * @param {number} height In cm
 * @param {number} width In cm
 * @param {string} deliveryPreferences 'premium' | 'standard'
 * @returns {number}
 */
export function totalPrice(shortestDistance, packageNumber, weight, height, width, deliveryPreferences) {
  const totalPriceWeight = deliveryPreferences === 'premium' ? 0.2 : 0.01;
  const distancePrice = parseFloat(shortestDistance) * parseFloat(totalPriceWeight);
  const weightPrice =
    parseFloat(weight || 0) *
    parseFloat(height || 0) *
    parseFloat(width || 0) *
    parseFloat(packageNumber || 1);
  const total = (distancePrice + weightPrice) / 1000;
  return parseFloat(total.toFixed(2));
}
