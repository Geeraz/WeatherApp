export function getLocation(location) {
  fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      location
    )}&key=4ecda18c50f140a5ac65e71f73ae52f8`
  )
    .then((response) => response.json())
    .then((data) => {
      const { lat, lng } = data.results[0].geometry;
      console.log(lat, lng);
    });
  function getWeather(lat, lng, timezone) {
    fetch(
      ` https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&timeformat=unixtime&timezone=${timezone}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }
}
