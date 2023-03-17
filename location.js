let lng, lat, timezone, fullName;

export async function getLocation(location) {
  const response = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      location
    )}&key=4ecda18c50f140a5ac65e71f73ae52f8`
  );
  const data = await response.json();
  fullName = data.results[0].formatted;
  timezone = data.results[0].annotations.timezone.name;
  lat = data.results[0].geometry.lat;
  lng = data.results[0].geometry.lng;

  return { lat, lng, timezone, fullName };
}

console.log();
console.log();
