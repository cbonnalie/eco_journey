export const fetchLocations = async (setLocations) => {
    try {
        const response = await fetch("/api/locations")
        const data = await response.json()
        const array = data.map(({city, state, latitude, longitude}) => ({
            city, state, latitude, longitude
        }))
        setLocations(array)
        localStorage.setItem("locations", JSON.stringify(array))
        console.log("locations fetched from the backend")
    } catch (error) {
        console.error("Error fetching locations:", error)
    }
}

export const fetchActivities = async (formData, setActivities) => {
    try {
        const queryParams = new URLSearchParams(
            {types: formData.activities.join(',')}).toString()
        const response = await fetch(`/api/activities?${queryParams}`)
        const data = await response.json()
        setActivities(data)
        console.log("activities fetched from the backend")
    } catch (error) {
        console.error("Error fetching activities:", error)
    }
}

export const fetchAirplaneCosts = async (setAirplaneCosts) => {
    const response = await fetch("/api/plane-costs")
    const data = await response.json()
    
    const {cost_per_mi, emissions_per_mi} = data[0]
    
    const parsedData = {
        cost_per_mi: parseFloat(cost_per_mi),
        co2_per_mi: parseFloat(emissions_per_mi)
    }
    
    setAirplaneCosts(parsedData)
    console.log("airplane costs fetched from the backend")
    console.log(data)
    console.log(parsedData)
}