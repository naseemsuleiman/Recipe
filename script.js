let searchBtn = document.getElementById('search-btn');
let mealList = document.getElementById('meal');
let mealDetailsContent = document.querySelector('.meal-details-content');
let recipeCloseBtn = document.getElementById('recipe-close-btn');
let ingredientDropdown = document.getElementById('ingredient-dropdown');

// Event listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

// Predefined list of common ingredients with more variety
let commonIngredients = [
    "chicken", "beef", "pork", "fish", "salmon", "tuna", "shrimp", "egg", "cheese",
    "tomato", "potato", "onion", "garlic", "carrot", "bell pepper", "spinach", "broccoli",
    "rice", "pasta", "bread", "flour", "milk", "butter", "cream", "yogurt", "sugar", "salt",
    "pepper", "cinnamon", "chili", "ginger", "soy sauce", "honey", "olive oil", "vinegar",
    "lamb", "turkey", "duck", "mushroom", "corn", "peas", "cabbage", "lettuce", "cucumber",
    "zucchini", "eggplant", "pineapple", "mango", "coconut", "almond", "cashew", "walnut",
    "lentils", "chickpeas", "black beans", "kidney beans", "oats", "quinoa", "barley","fries"
];

// Populate dropdown with ingredients
function populateIngredientDropdown() {
    commonIngredients.forEach(ingredient => {
        let option = document.createElement('option');
        option.value = ingredient;
        option.textContent = ingredient.charAt(0).toUpperCase() + ingredient.slice(1);
        ingredientDropdown.appendChild(option);
    });
}

document.addEventListener('DOMContentLoaded', populateIngredientDropdown);

// Get meal list that matches with the ingredients
function getMealList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    if (searchInputTxt === "") {
        mealList.innerHTML = "<p>Please enter an ingredient.</p>";
        mealList.classList.add('notFound');
        return;
    }
    
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
        .then(response => response.json())
        .then(data => {
            let html = "";
            if (data.meals) {
                data.meals.slice(0, 20).forEach(meal => {
                    html += `
                        <div class="meal-item" data-id="${meal.idMeal}">
                            <div class="meal-img">
                                <img src="${meal.strMealThumb}" alt="food">
                            </div>
                            <div class="meal-name">
                                <h3>${meal.strMeal}</h3>
                                <a href="#" class="recipe-btn">Get Recipe</a>
                            </div>
                        </div>
                    `;
                });
                mealList.classList.remove('notFound');
            } else {
                html = "<p>Sorry, we didn't find any meals with that ingredient. Try using a more general term.</p>";
                mealList.classList.add('notFound');
            }
            mealList.innerHTML = html;
        })
        .catch(error => {
            console.error("Error fetching meals:", error);
            mealList.innerHTML = "<p>Failed to fetch meal data. Please try again later.</p>";
        });
}

// Get recipe of the meal
function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.matches('.recipe-btn')) {
        let mealItem = e.target.closest('.meal-item');
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
            .then(response => response.json())
            .then(data => {
                if (data.meals) {
                    let meal = data.meals[0];
                    document.querySelector('.recipe-title').textContent = meal.strMeal;
                    document.querySelector('.recipe-category').textContent = meal.strCategory;
                    document.querySelector('.recipe-instruct p').textContent = meal.strInstructions;
                    document.querySelector('.recipe-meal-img img').src = meal.strMealThumb;
                    mealDetailsContent.parentElement.classList.add('showRecipe');
                }
            })
            .catch(error => {
                console.error("Error fetching recipe:", error);
                mealDetailsContent.innerHTML = "<p>Failed to fetch recipe details. Please try again later.</p>";
            });
    }
}


