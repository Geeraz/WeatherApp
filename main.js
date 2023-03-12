import { getLocationTemp } from './weather.js';

const countryInput = document.querySelector(".country-input");
const check = document.querySelector(".check");

check.addEventListener("click", function (e) {
  e.preventDefault();
  
  async function parseData() {
    const data = await getLocationTemp(countryInput.value);
    console.log(data); // log the fetched data to the console
  
    // manipulate the fetched data here
  }
  parseData();
});