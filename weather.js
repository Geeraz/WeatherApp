let obj = {};

async function getLocationTemp(location) {
  const response = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      location
    )}&key=4ecda18c50f140a5ac65e71f73ae52f8`
  );
  const data = await response.json();

  const timezone = data.results[0].annotations.timezone.name;
  const { lat, lng } = data.results[0].geometry;

  const response2 = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&timeformat=unixtime&timezone=${timezone}`
  );
  const data2 = await response2.json();

  obj = {
    current: parseCurrentWeather(data2),
    daily: parseDailyWeather(data2),
    hourly: parseHourlyWeather(data2),
  };
  return obj;
}

export { getLocationTemp };

function parseCurrentWeather({ current_weather, daily }) {
  const {
    temperature: currentTemp,
    windspeed: windSpeed,
    weathercode: iconCode,
  } = current_weather;
  const {
    temperature_2m_max: [maxTemp],
    temperature_2m_min: [minTemp],
    apparent_temperature_max: [maxFeelsLike],
    apparent_temperature_min: [minFeelsLike],
    precipitation_sum: [precip],
  } = daily;
  return {
    currentTemp: Math.round(currentTemp),
    highTemp: Math.round(maxTemp),
    lowTemp: Math.round(minTemp),
    highFeelsLike: Math.round(maxFeelsLike),
    lowFeelsLike: Math.round(minFeelsLike),
    windSpeed: Math.round(windSpeed),
    precip: Math.round(precip * 100) / 100,
    iconCode,
  };
}

function parseDailyWeather({ daily }) {
  return daily.time.map((time, index) => {
    return {
      timestamp: time * 1000,
      iconCode: daily.weathercode[index],
      maxTemp: Math.round(daily.temperature_2m_max[index]),
    };
  });
}

function parseHourlyWeather({ hourly, current_weather }) {
  return hourly.time
    .map((time, index) => {
      return {
        timestamp: time * 1000,
        iconCode: hourly.weathercode[index],
        temp: Math.round(hourly.temperature_2m[index]),
        feelsLike: Math.round(hourly.apparent_temperature[index]),
        windSpeed: Math.round(hourly.windspeed_10m[index]),
        precip: Math.round(hourly.precipitation[index] * 100) / 100,
      };
    })
    .filter(({ timestamp }) => timestamp >= current_weather.time * 1000);
}
