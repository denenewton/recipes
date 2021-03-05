const $ = el => document.querySelector(el);

const overlay = $(".overlay");
const btnPopup = $(".user__shearch-button");
const popupContent = $(".search__popupp-content");

function hiddenSearch() {
  overlay.classList.remove("show");
  popupContent.classList.remove("show");
}

btnPopup.addEventListener("click", () => {
  overlay.classList.toggle("show");
  popupContent.classList.toggle("show");
});
overlay.addEventListener("click", () => {
  hiddenSearch();
});

/* fetch resuls for the meals  */
const $$ = el => document.getElementById(el);
const search = $$("search"),
  submit = $$("submit"),
  mealsEl = $$("meals"),
  resultHeading = $$("result-heading"),
  single_mealEl = $$("single-meal");

function searchMeal(e) {
  e.preventDefault();
  //clear results
  single_mealEl.innerHTML = "";

  const term = search.value;
  console.log(term);
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then(resp => resp.json())
      .then(data => {
        console.log(data.meals);
        resultHeading.innerHTML = `<h1 class='result-heading-title'>Search results for '${term}':</h1>`;
        if (data.meals === null) {
          resultHeading.innerHTML = `<h1 class='result-heading-title'>There no search results for '${term}', try again!</h1>`;
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              meal =>
                `<div class="meal">
                  <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                  <div class="meal-info" data-mealID="${meal.idMeal}">
                    <h3 >${meal.strMeal}</h3>
                  </div>
                </div>`
            )
            .join(" ");
        }
        //Clear search text
        search.value = "";
        hiddenSearch();
      });
  } else {
    alert("Please enter a search term!");
  }
}

// Event listeners
submit.addEventListener("submit", searchMeal);
