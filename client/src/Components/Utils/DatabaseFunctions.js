import {calculateCosts} from "./Calculators";

export const fetchLocations = async (setLocations) => {
    try {
        const response = await fetch("/api/locations")
        const data = await response.json()
        const array = data.map(
            ({city, state, latitude, longitude, geographical_feature, location_id}) =>
                ({city, state, latitude, longitude, geographical_feature, location_id})
        )
        setLocations(array)
        localStorage.setItem("locations", JSON.stringify(array))
        console.log("locations fetched from the backend")
    } catch (error) {
        console.error("Error fetching locations:", error)
    }
}

export const fetchActivityTypes = async (setActivityTypes) => {
    try {
        const response = await fetch("/api/activity-types")
        const data = await response.json()
        const array = data.map(
            ({activity_id, name, type, location_id, cost, co2_emissions}) =>
                ({activity_id, name, type, location_id, cost, co2_emissions})
        )
        setActivityTypes(array)
        console.log("activities fetched from the backend")
    } catch (error) {
        console.error("Error fetching activity types:", error)
    }
}

export const fetchGeographyTypes = async (setGeoTypes) => {
    try {
        const response = await fetch("/api/geography-types")
        const data = await response.json()
        setGeoTypes(data)
        console.log("geography types fetched from the backend")
    } catch (error) {
        console.error("Error fetching geography types:", error)
    }
}

export const fetchActivitiesByType = async (formData, setActivities) => {
    try {
        const queryParams = new URLSearchParams({types: formData.activities.join(',')}).toString()
        const response = await fetch(`/api/activities?${queryParams}`)
        const data = await response.json()
        setActivities(data)
        console.log("activities fetched from the backend")
    } catch (error) {
        console.error("Error fetching activities:", error)
    }
}

export const fetchTransportationByName = async (name) => {
    try {
        const response = await fetch(`/api/transportation?name=${name}`)
        const data = await response.json()
        return data.map(
            ({transport_id, name, cost_per_mi, emissions_per_mi}) =>
                ({transport_id, name, cost_per_mi, emissions_per_mi})
        )[0] // only one transportation type should be returned
    } catch (error) {
        console.error("Error fetching transportation by name:", error)
    }
}

export const fetchActivitiesByTripId = async (trip_id) => {
    try {
        const response = await fetch(`/api/activities-by-trip-id?trip_id=${trip_id}`)
        const data = await response.json()
        return data.map(
            ({activity_id, name, type, location_id, cost, co2_emissions}) =>
                ({activity_id, name, type, location_id, cost, co2_emissions})
        )
    } catch (error) {
        console.error("Error fetching activities by trip id:", error)
    }
}

export const fetchLocationsByTripId = async (trip_id) => {
    try {
        const response = await fetch(`/api/locations-by-trip-id?trip_id=${trip_id}`)
        const data = await response.json()
        return data.map(
            ({city, state, latitude, longitude, geographical_feature, location_id}) =>
                ({city, state, latitude, longitude, geographical_feature, location_id})
        )
    } catch (error) {
        console.error("Error fetching locations by trip id:", error)
    }
}

export const fetchTransportationByTripId = async (trip_id) => {
    try {
        const response = await fetch(`/api/transportation-by-trip-id?trip_id=${trip_id}`)
        const data = await response.json()
        return data.map(
            ({transport_id, name, cost_per_mi, emissions_per_mi}) =>
                ({transport_id, name, cost_per_mi, emissions_per_mi})
        )
    } catch (error) {
        console.error("Error fetching transportation by trip id:", error)
    }
}

export const fetchUsernameEmailTaken = async (username, email) => {
    try {
        const response = await fetch(`/api/username-email-taken?username=${username}&email=${email}`)
        const data = await response.json()
        return data.taken
    } catch (error) {
        console.error("Error checking if username or email is taken:", error)
    }
}

export const fetchUserId = async (username, password) => {
    try {
        const response = await fetch(`/api/login?username=${username}&password=${password}`)
        const data = await response.json()
        return data.user_id
    } catch (error) {
        console.error("Error fetching user id:", error)
    }
}

export const fetchTransportationByDistance = async (distance) => {
    try {
        const transportationType = distance > 400 ? "Airplane" : "Car Rental"
        return await fetchTransportationByName(transportationType)
    } catch (error) {
        console.error("Error fetching transportation by distance:", error)
    }
}

export const addTripData = async (UserActivation, state, distance, transportation, activities, locations) => {
    try {
        // calculate costs and emissions for the trip
        const {transportationCost, transportationCO2, totalCost, totalCO2} 
            = calculateCosts(activities, transportation, distance)
        // bundle all trip data together to send to the database
        const tripData = {
            user_id: UserActivation.id,
            total_cost: totalCost,
            total_emissions: totalCO2
        }
        // add the trip to the database
        const trip = await addTrip(tripData)
        // add the activities, locations, and transportation to their respective tables
        await Promise.all([
            addTripActivities(trip.trip_id, activities),
            addTripLocations(trip.trip_id, locations),
            addTripTransportation(
                trip.trip_id, transportation.transport_id, distance, transportationCost, transportationCO2)
        ])
        return {
            ...tripData,
            trip_id: trip.trip_id,
            state,
            locations,
            activities,
            transportation,
            distance
        }
    } catch (error) {
        console.error("Error adding trip data:", error)
    }
}

export const addTrip = async (tripData) => {
    try {
        const response = await fetch("/api/add-trip", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(tripData)
        })
        return await response.json()
    } catch (error) {
        console.error("Error adding trip:", error)
        throw error
    }
}

export const addTripActivities = async (trip_id, activities) => {
    try {
        await fetch("/api/add-trip-activities", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                trip_id: trip_id, activities
            })
        })
    } catch (error) {
        console.error("Error adding trip activities:", error)
    }
}

export const addTripLocations = async (trip_id, locations) => {
    try {
        await fetch("/api/add-trip-locations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({trip_id: trip_id, locations})
        })
    } catch (error) {
        console.error("Error adding trip locations:", error)
    }
}

export const addTripTransportation = async (trip_id, transport_id, distance, transportationCost, transportationCO2) => {
    try {
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
    } catch (error) {
        console.error("Error adding trip transportation:", error)
    }
}

export const saveTripData = async (user_id, trip_id) => {
    try {
        const saveData = {
            user_id: user_id,
            trip_id: trip_id,
            // courtesy https://stackoverflow.com/questions/5129624/convert-js-date-time-to-mysql-datetime
            saved_at: new Date().toISOString().slice(0, 19).replace("T", " ")
        }
        const response = await fetch("/api/save-trip", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(saveData)
        })
        if (response.ok) {
            console.log("Trip saved successfully")
            return true
        } else {
            console.error("Error saving trip")
            return false
        }
    } catch (error) {
        console.error("Error saving trip:", error)
        return false
    }
}
