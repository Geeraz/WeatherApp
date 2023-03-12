// console.log(getLocationTemp("Uskoplje"));
const countryInput = document.querySelector(".country-input");
const check = document.querySelector(".check");

check.addEventListener("click", function (e) {
  e.preventDefault();
  console.log(getLocationTemp(countryInput.value));
});

console.log(test);
