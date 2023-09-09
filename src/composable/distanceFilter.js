function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance*1000;
}

export default {
  filter(minimumDistance, rawGeo) {
    let route = []
    for (let index = 0; index < rawGeo.length; index++) {
    if (index!=rawGeo.length-1) {
        let distance = calculateDistance(rawGeo[index].latitude,rawGeo[index].longitude,rawGeo[index+1].latitude,rawGeo[index+1].longitude)
        if (distance <= minimumDistance) {
          route.pop()
          route.push(rawGeo[index+1])
        } else {
          route.push(rawGeo[index+1])
        }
      }
    }
    return {
      route
    }
  }
}