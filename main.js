import { ICON_MAP } from "./iconMap.js";
import { getLocationTemp } from "./weather.js";

const countryInput = document.querySelector(".country-input");
const check = document.querySelector(".check");

check.addEventListener("click", function (e) {
  e.preventDefault();

  async function parseData() {
    const data = await getLocationTemp(countryInput.value);
    console.log(data); // log the fetched data to the console

    renderWeather(data);
  }
  parseData();
});

// Search on enter
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    check.click();
  }
});

function renderWeather({ current, daily, hourly }) {
  renderCurrentWeather(current);
  renderDailyWeather(daily);
  renderHourlyWeather(hourly);
  document.querySelector(".body").classList.remove("blurred");
}

function setValue(selector, value, { parent = document } = {}) {
  parent.querySelector(`[data-${selector}]`).textContent = value;
}

function getIconUrl(iconCode) {
  return `icons/${ICON_MAP.get(iconCode)}.svg`;
}

const currentIcon = document.querySelector("[data-current-icon]");

function renderCurrentWeather(current) {
  setValue("current-temp", current.currentTemp);
  setValue("current-high", current.highTemp);
  setValue("current-low", current.lowTemp);
  setValue("current-fl-high", current.highFeelsLike);
  setValue("current-fl-low", current.lowFeelsLike);
  setValue("current-wind", current.windSpeed);
  setValue("current-precip", current.precip);
}

const dailySection = document.querySelector("[data-day-section]");
const dayCardTemplate = document.getElementById("day-card-template");
const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: "long" });

function renderDailyWeather(daily) {
  dailySection.innerHTML = "";
  daily.forEach((day) => {
    const elemet = dayCardTemplate.content.cloneNode(true);
    setValue("temp", day.maxTemp, { parent: elemet });
    setValue("date", DAY_FORMATTER.format(day.timestamp), { parent: elemet });
    elemet.querySelector("[data-icon]").src = getIconUrl(day.iconCode);
    dailySection.append(elemet);
  });
}

const hourlySection = document.querySelector("[data-hour-section]");
const hourRowTemplate = document.getElementById("hour-row-template");
const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
});

function renderHourlyWeather(hourly) {
  hourlySection.innerHTML = "";
  hourly.forEach((hour) => {
    const elemet = hourRowTemplate.content.cloneNode(true);
    setValue("temp", hour.temp, { parent: elemet });
    setValue("fl-temp", hour.feelsLike, { parent: elemet });
    setValue("wind", hour.windSpeed, { parent: elemet });
    setValue("precip", hour.precip, { parent: elemet });
    setValue("day", DAY_FORMATTER.format(hour.timestamp), { parent: elemet });
    setValue("date", HOUR_FORMATTER.format(hour.timestamp), {
      parent: elemet,
    });
    elemet.querySelector("[data-icon]").src = getIconUrl(hour.iconCode);
    hourlySection.append(elemet);
  });
}
