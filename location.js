// Fetching location,latitude and longitude based on input.

let lng, lat, timezone, fullName;

export async function getLocation(location = "Berlin") {
  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        location
      )}&key=4ecda18c50f140a5ac65e71f73ae52f8&language=en`
    );
    if (!response.ok) {
      throw new Error("Error in fetching.");
    }
    const data = await response.json();

    fullName = `${
      data.results[0].components.city || data.results[0].components.town
    }, ${data.results[0].components.country}`;
    timezone = data.results[0].annotations.timezone.name;
    lat = data.results[0].geometry.lat;
    lng = data.results[0].geometry.lng;

    return { lat, lng, timezone, fullName };
  } catch (error) {
    console.error(error);

    alert(
      "There was an error fetching the data. Please try again by entering the location name correctly.."
    );
  }
}
