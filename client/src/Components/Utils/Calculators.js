
/**
 * Calculate the distance between two points given their
 * latitude and longitude using the haversine formula.
 * 
 * @param latStart - latitude of the starting point
 * @param lonStart - longitude of the starting point
 * @param latEnd - latitude of the ending point
 * @param lonEnd - longitude of the ending point
 * @returns {number} - distance between the two points in miles
 */
export function calculateDistance(latStart, lonStart, latEnd, lonEnd) {
    
    // convert degrees to radians
    const toRadians = (degrees) => degrees * (Math.PI / 180)
    latStart = toRadians(latStart)
    lonStart = toRadians(lonStart)
    latEnd = toRadians(latEnd)
    lonEnd = toRadians(lonEnd)

    // difference in latitudes and longitudes
    const deltaLat = latEnd - latStart
    const deltaLon = lonEnd - lonStart

    // components of haversine formula
    // haversine function: hav(x) = sin^2(x/2)
    const havFuncLat = Math.sin(deltaLat / 2) ** 2
    const havFuncLon = Math.sin(deltaLon / 2) ** 2
    // cosines of the latitudes for horizontal distance
    const cosLatStart = Math.cos(latStart)
    const cosLatEnd = Math.cos(latEnd)
    
    // get hav(x) where x = distance / radius
    const angularDistance = havFuncLat + havFuncLon * cosLatStart * cosLatEnd
    
    // solve for distance
    const centralAngle = 2 * Math.asin(Math.sqrt(angularDistance))
    const earthRadius = 3958.8
    return earthRadius * centralAngle
}

export function calculateCosts(activities, transportation, distance) {
    const activityCost = activities.reduce((acc, activity) => acc + parseFloat(activity.cost), 0)
    const activityCO2 = activities.reduce((acc, activity) => acc + parseFloat(activity.co2_emissions), 0)
    const transportationCost = distance * transportation.cost_per_mi * 2
    const transportationCO2 = distance * transportation.emissions_per_mi * 2
    const totalCost = transportationCost + activityCost
    const totalCO2 = transportationCO2 + activityCO2
    return {transportationCost, transportationCO2, totalCost, totalCO2}
}
