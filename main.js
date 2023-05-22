import { ICON_MAP } from "./iconMap.js";
import { getTemp } from "./weather.js";
import { getLocation } from "./location.js";

const countryInput = document.querySelector(".country-input");
const check = document.querySelector(".check");
const loader = document.querySelector(".loader");
const body = document.querySelector(".body");
const country = document.querySelector(".country");
const date = document.querySelector(".date");

// Getting user timezone
let userTimeZone;
function getUserTimeZone() {
  userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return userTimeZone;
}
getUserTimeZone();

// Crating new date
const now = new Date();
date.textContent = now.toLocaleString(undefined, {
  timeZone: `${userTimeZone}`,
});

// Initial show
parseData("Berlin");

let data, data1;

async function parseData(location) {
  loader.classList.remove("hidden");

  data = await getLocation(location);
  data1 = await getTemp(data);
  renderWeather(data1);
  renderHourlyWeather(data1.hourly.slice(0, 24));

  loader.classList.add("hidden");
  body.classList.remove("blurred");
  country.textContent = data.fullName;

  dayDataShow();
}

// Input cheker
check.addEventListener("click", function (e) {
  e.preventDefault();
  body.classList.add("blurred");
  parseData(countryInput.value);
});

// Search on enter
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    check.click();
  }
});

// Rendering hourly info by clicking on day card
function dayDataShow() {
  const hourRows = document.querySelectorAll(".hour-row");
  const dayCards = document.querySelectorAll(".day-card");
  dayCards.forEach((day) =>
    day.addEventListener("click", (e) => {
      e.preventDefault;
      hourlySection.innerHTML = "";

      const pressedDay =
        e.currentTarget.querySelector("[data-date]").textContent;
      const dayData = renderHourlyWeather(
        data1.hourly.filter(function cheker({ timestamp }) {
          return DAY_FORMATTER.format(timestamp) === pressedDay;
        })
      );
    })
  );
}

// Rendering data separately, destructuring parsed object.
function renderWeather({ current, daily, hourly }) {
  renderCurrentWeather(current);
  renderDailyWeather(daily);
  renderHourlyWeather(hourly);
}

// Helper function for selecting elements
function setValue(selector, value, { parent = document } = {}) {
  parent.querySelector(`[data-${selector}]`).textContent = value;
}

// Helper function for geting icon path
function getIconUrl(iconCode) {
  return `icons/${ICON_MAP.get(iconCode)}.svg`;
}

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
const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  timeZone: `${userTimeZone}`,
});

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
  timeZone: `${userTimeZone}`,
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
