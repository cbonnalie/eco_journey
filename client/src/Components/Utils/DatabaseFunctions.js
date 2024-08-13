export const fetchLocations = async (setLocations) => {
    try {
        const response = await fetch("/api/locations")
        const data = await response.json()
        const array = data.map(({city, state, latitude, longitude, geographical_feature, location_id}) => ({
            city, state, latitude, longitude, geographical_feature, location_id
        }))
        setLocations(array)
        localStorage.setItem("locations", JSON.stringify(array))
        console.log("locations fetched from the backend")
    } catch (error) {
        console.error("Error fetching locations:", error)
    }
}

export const fetchActivityTypes = async (setActivityTypes) => {
    const response = await fetch("/api/activity-types")
    const data = await response.json()
    const array = data.map(({activity_id, name, type, location_id, cost, co2_emissions}) => ({
        activity_id, name, type, location_id, cost, co2_emissions
    }))
    setActivityTypes(array)
    console.log("activities fetched from the backend")
}

export const fetchGeographyTypes = async (setGeoTypes) => {
    const response = await fetch("/api/geography-types")
    const data = await response.json()
    setGeoTypes(data)
    console.log("geography types fetched from the backend")
}

export const fetchActivitiesByType = async (formData, setActivities) => {
    try {
        const queryParams = new URLSearchParams(
            {types: formData.activities.join(',')}).toString()
        console.log("FABT: ", queryParams)
        const response = await fetch(`/api/activities?${queryParams}`)
        const data = await response.json()
        setActivities(data)
        console.log("activities fetched from the backend")
    } catch (error) {
        console.error("Error fetching activities:", error)
    }
}

export const fetchTransportationByName = async (name) => {
    const response = await fetch(`/api/transportation?name=${name}`)
    const data = await response.json()
    return data.map(({transport_id, name, cost_per_mi, emissions_per_mi}) => ({
        transport_id, name, cost_per_mi, emissions_per_mi
    }))[0]
}

export const fetchActivitiesByTripId = async (trip_id) => {
    const response = await fetch(`/api/activities-by-trip-id?trip_id=${trip_id}`)
    const data = await response.json()
    return data.map(({activity_id, name, type, location_id, cost, co2_emissions}) => ({
        activity_id, name, type, location_id, cost, co2_emissions
    }))
}

export const fetchLocationsByTripId = async (trip_id) => {
    const response = await fetch(`/api/locations-by-trip-id?trip_id=${trip_id}`)
    const data = await response.json()
    return data.map(({city, state, latitude, longitude, geographical_feature, location_id}) => ({
        city, state, latitude, longitude, geographical_feature, location_id
    }))
}

export const fetchTransportationByTripId = async (trip_id) => {
    const response = await fetch(`/api/transportation-by-trip-id?trip_id=${trip_id}`)
    const data = await response.json()
    return data.map(({transport_id, name, cost_per_mi, emissions_per_mi}) => ({
        transport_id, name, cost_per_mi, emissions_per_mi
    }))
}

export const fetchUsernameEmailTaken = async (username, email) => {
    const response = await fetch(`/api/username-email-taken?username=${username}&email=${email}`)
    const data = await response.json()
    return data.taken
}

export const fetchUserId = async (username, password) => {
    const response = await fetch(`/api/login?username=${username}&password=${password}`)
    console.log(response)
    const data = await response.json()
    console.log("fetchers:", data.user_id)
    return data.user_id
}

export const fetchTransportationByDistance = async (distance) => {
    const transportationType = distance > 400 ? "Airplane" : "Car Rental";
    return await fetchTransportationByName(transportationType)
}

export const addTripData = async (UserActivation,  state, distance, transportation, activities, locations) => {
    const activityCost = activities.reduce((acc, activity) => acc + parseFloat(activity.cost), 0)
    const activityCO2 = activities.reduce((acc, activity) => acc + parseFloat(activity.co2_emissions), 0)
    const transportationCost = distance * transportation.cost_per_mi * 2
    const transportationCO2 = distance * transportation.emissions_per_mi * 2
    const totalCost = transportationCost + activityCost
    const totalCO2 = transportationCO2 + activityCO2
    
    const tripData = {
        user_id: UserActivation.id,
        total_cost: totalCost,
        total_emissions: totalCO2
    }
    
    const tripResult = await fetch("/api/add-trip", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tripData)
    })
    
    const trip = await tripResult.json()
    
    await Promise.all([
        addTripActivities(trip.trip_id, activities), 
        addTripLocations(trip.trip_id, locations),
        addTripTransportation(trip.trip_id, 
            transportation.transport_id, distance, transportationCost, transportationCO2)
    ])

    return {
        ...tripData,
        trip_id: trip.trip_id,
        state,
        locations,
        activities,
        transportation,
        distance
    };
}

export const addTripActivities = async (trip_id, activities) => {
    await fetch("/api/add-trip-activities", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            trip_id: trip_id, activities
        })
    })
}

export const addTripLocations = async (trip_id, locations) => {
    await fetch("/api/add-trip-locations", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({trip_id: trip_id, locations})
    })
}

export const addTripTransportation = async (trip_id, transport_id, distance, transportationCost, transportationCO2) => {
    await fetch("/api/add-trip-transportation", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            trip_id: trip_id,
            transport_id: transport_id,
            distance_mi: distance,
            total_cost: transportationCost,
            total_emissions: transportationCO2
        })
    })
}