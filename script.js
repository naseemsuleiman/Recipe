const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

// Event listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

// Load random meals on page load
document.addEventListener("DOMContentLoaded", getRandomMeals);

// Fetch random meals
function getRandomMeals() {
    mealList.innerHTML = `<p>Loading meals...</p>`;
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`)
        .then(response => response.json())
        .then(data => {
            displayMeals(data.meals);
        })
        .catch(error => {
            console.error("Error fetching random meals:", error);
            mealList.innerHTML = `<p>Failed to load meals. Try refreshing.</p>`;
        });
}

// Fetch meals based on search input
function getMealList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    if (searchInputTxt === "") {
        return getRandomMeals(); // Reload random meals if search is empty
    }
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
        .then(response => response.json())
        .then(data => {
            if (data.meals) {
                displayMeals(data.meals);
            } else {
                mealList.innerHTML = `<p>Sorry, no meals found for "${searchInputTxt}"</p>`;
            }
        })
        .catch(error => {
            console.error("Error fetching meal list:", error);
            mealList.innerHTML = `<p>Something went wrong. Try again.</p>`;
        });
}

// Display meals on the page
function displayMeals(meals) {
    let html = meals.map(meal => `
        <div class="meal-item" data-id="${meal.idMeal}">
            <div class="meal-img">
                <img src="${meal.strMealThumb}" alt="food">
            </div>
            <div class="meal-name">
                <h3>${meal.strMeal}</h3>
                <a href="#" class="recipe-btn">Get Recipe</a>
            </div>
        </div>
    `).join("");
    mealList.innerHTML = html;
}

// Fetch recipe details
function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        let mealItem = e.target.closest('.meal-item');
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
            .then(response => response.json())
            .then(data => mealRecipeModal(data.meals[0]))
            .catch(error => console.error("Error fetching meal recipe:", error));
    }
}

// Display recipe modal
function mealRecipeModal(meal) {
    let html = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category"><strong>Category:</strong> ${meal.strCategory}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.strMealThumb}" alt="">
        </div>
        <button id="save-recipe">Save Recipe</button>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');

    document.getElementById("save-recipe").addEventListener("click", () => saveRecipe(meal));
}

// Save recipe to local storage
function saveRecipe(meal) {
    let savedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];
    if (savedRecipes.some(recipe => recipe.idMeal === meal.idMeal)) {
        alert("This recipe is already saved!");
        return;
    }
    savedRecipes.push(meal);
    localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
    alert("Recipe saved successfully!");
}


// Display recipe modal
function mealRecipeModal(meal) {
    let html = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category"><strong>Category:</strong> ${meal.strCategory}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.strMealThumb}" alt="">
        </div>
        
        <div id="rating-container">
            <div class="star-rating" id="star-rating">
                ${[5, 4, 3, 2, 1].map(star => `<span class="star" data-value="${star}">★</span>`).join("")}
            </div>
            <p id="user-rating">No rating yet</p>
        </div>
        <a href="shopping.html" id="ingredients">Get ingredients</a>
        <div id="share-container">
            <h3>Share this Recipe:</h3>
            <a href="#" id="share-facebook"><i class="fab fa-facebook"></i></a>
            <a href="#" id="share-twitter"><i class="fab fa-twitter"></i></a>
            <a href="#" id="share-whatsapp"><i class="fab fa-whatsapp"></i></a>
            <a href="#" id="share-email"><i class="fas fa-envelope"></i></a>
        </div>
        <button id="save-recipe">Save Recipe</button>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');

    document.getElementById("save-recipe").addEventListener("click", () => saveRecipe(meal));
    setupStarRating(meal.idMeal);
    setupSocialSharing(meal);
}

    function checkForSelectedRecipe() {
        const mealData = localStorage.getItem("selectedMeal");
        if (mealData) {
            const meal = JSON.parse(mealData);
            mealRecipeModal(meal);  // Call the function that displays the recipe
            localStorage.removeItem("selectedMeal"); // Clear it to avoid showing it every time
        }
    }

    window.addEventListener("load", checkForSelectedRecipe);


// Save recipe to local storage
function saveRecipe(meal) {
    let savedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];
    if (savedRecipes.some(recipe => recipe.idMeal === meal.idMeal)) {
        alert("This recipe is already saved!");
        return;
    }
    savedRecipes.push(meal);
    localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
    alert("Recipe saved successfully!");
}

// Star rating system
function setupStarRating(mealId) {
    const stars = document.querySelectorAll(".star");
    const userRatingText = document.getElementById("user-rating");
    const savedRating = localStorage.getItem(`recipeRating_${mealId}`);
    if (savedRating) {
        highlightStars(savedRating);
        userRatingText.textContent = `Your rating: ${savedRating} stars`;
    }

    stars.forEach(star => {
        star.addEventListener("click", function () {
            const rating = this.getAttribute("data-value");
            localStorage.setItem(`recipeRating_${mealId}`, rating);
            highlightStars(rating);
            userRatingText.textContent = `Your rating: ${rating} stars`;
        });
    });

    function highlightStars(rating) {
        stars.forEach(star => {
            star.classList.toggle("selected", star.getAttribute("data-value") <= rating);
        });
    }
}

// Social sharing functionality
function setupSocialSharing(meal) {
    const recipeUrl = window.location.href;
    const shareText = `Check out this recipe: ${meal.strMeal}`;
    
    document.getElementById("share-facebook").addEventListener("click", () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(recipeUrl)}`, "_blank");
    });

    document.getElementById("share-twitter").addEventListener("click", () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(recipeUrl)}`, "_blank");
    });

    document.getElementById("share-whatsapp").addEventListener("click", () => {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + recipeUrl)}`, "_blank");
    });

    document.getElementById("share-email").addEventListener("click", () => {
        window.location.href = `mailto:?subject=${encodeURIComponent("Try this recipe!")}&body=${encodeURIComponent(shareText + " " + recipeUrl)}`;
    });
}
