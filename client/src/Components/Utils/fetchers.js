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