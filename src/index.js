const $ = el => document.querySelector(el);

const overlay = $('.overlay');
const btnPopup = $('.user__shearch-button');
const popupContent = $('.search__popupp-content');

function hiddenSearch() {
  overlay.classList.remove('show');
  popupContent.classList.remove('show');
}

btnPopup.addEventListener('click', () => {
  overlay.classList.toggle('show');
  popupContent.classList.toggle('show');
  search.focus();
});
overlay.addEventListener('click', () => {
  hiddenSearch();
});

/* fetch resuls for the meals  */
const $$ = el => document.getElementById(el);
const search = $$('search'),
  submit = $$('submit'),
  mealsEl = $$('meals'),
  resultHeading = $$('result-heading'),
  single_mealEl = $$('single-meal');

function searchMeal(e) {
  e.preventDefault();
  //clear results
  single_mealEl.innerHTML = '';

  const term = search.value;
  console.log(term);
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then(resp => resp.json())
      .then(data => {
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
            .join(' ');
        }
        //Clear search text
        search.value = '';
        hiddenSearch();
      });
  } else {
    alert('Please enter a search term!');
  }
}

// Add meal to the DOM
function addMealToDOM(meal) {
  mealsEl.innerHTML = '';
  resultHeading.innerHTML = '';
  const ingredients = [];
  for (let i = 1; i < 21; i++) {
    if (`${meal[`strIngredient${i}`]}`) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else break;
  }
  single_mealEl.innerHTML = `
  <div class="single-meal">
    <div class="row">
      <h1>${meal.strMeal}</h1>
    </div>
    <div class='image-meal'>
      <div class="image-box">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <div class="single-meal-info">
          ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
          ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
        </div>
     </div>
    </div>
      <div class="instructions">
        <h2>Instructions</h2>
        <p>${meal.strInstructions}</p>
      </div>

      <div class='ingredients'>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map(ing => `<li><p>${ing}</p></li>`).join('')}
        </ul>
     </div>
 </div>`;
}

// Fetch meal by ID
function getMealById(id) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(resp => resp.json())
    .then(data => {
      const meal = data.meals[0];
      console.log(meal);
      addMealToDOM(meal);
    });
}

// Event listeners
submit.addEventListener('submit', searchMeal);
mealsEl.addEventListener('click', e => {
  const mealInfo = e.path.find(el => {
    if (el.classList) {
      return el.classList.contains('meal-info');
    } else return;
  });
  console.log(mealInfo);
  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid');
    getMealById(mealID);
  }
});
