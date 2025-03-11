const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const cartClose = document.querySelector("#cart-close");
const cartContent = document.querySelector(".cart-content");
const productContent = document.querySelector(".product-content");

// Get search input and button elements
const searchInputEl = document.querySelector("#search-input");
const searchButtonEl = document.querySelector("#search-button");

let allIngredients = []; // Store all ingredients globally

// Open and close cart
cartIcon.addEventListener("click", () => cart.classList.add("active"));
cartClose.addEventListener("click", () => cart.classList.remove("active"));

// Fetch ingredients from API
const fetchIngredients = async () => {
    try {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list");
        const data = await response.json();
        allIngredients = data.meals.slice(0, 10000); // Store all ingredients
        displayIngredients(allIngredients);
    } catch (error) {
        console.error("Error fetching ingredients:", error);
    }
};

// Display ingredients inside `.product-content`
const displayIngredients = ingredients => {
    productContent.innerHTML = ""; // Clear previous content
    ingredients.forEach(ingredient => {
        const ingredientBox = document.createElement("div");
        ingredientBox.classList.add("product-box");
        ingredientBox.innerHTML = `
            <div class="img-box">
                <img src="https://www.themealdb.com/images/ingredients/${ingredient.strIngredient}.png" alt="${ingredient.strIngredient}"> 
            </div>
            <h2 class="product-title">${ingredient.strIngredient}</h2> 
            <p class="price">${ingredient.strDescription ? ingredient.strDescription.substring(0, 100) + "..." : "No description available"}</p> 
            <div class="price-and-cart">
                <span class="price">$${(Math.random() * 10 + 1).toFixed(2)}</span>
                <i class="ri-shopping-bag-line add-cart"></i>
            </div>
        `;
        productContent.appendChild(ingredientBox);
    });
    attachAddToCartEvent(); // Attach event listeners to "Add to Cart" buttons
};

// Function to filter ingredients based on search input
const searchIngredients = () => {
    const query = searchInputEl.value.trim().toLowerCase();
    if (query) {
        const filteredIngredients = allIngredients.filter(ingredient => 
            ingredient.strIngredient.toLowerCase().includes(query)
        );
        displayIngredients(filteredIngredients);
    } else {
        displayIngredients(allIngredients); 
    }
};

// Event listener for search button
searchButtonEl.addEventListener("click", searchIngredients);

// Event listener for pressing "Enter" key in search input
searchInputEl.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        searchIngredients();
    }
});

// Attach event listeners to "Add to Cart" buttons
const attachAddToCartEvent = () => {
    document.querySelectorAll(".add-cart").forEach(button => {
        button.addEventListener("click", event => {
            const productBox = event.target.closest(".product-box");
            addToCart(productBox); 
        });
    });
};

// Function to add item to cart
const addToCart = productBox => {
    const productImg = productBox.querySelector("img").src;
    const productTitle = productBox.querySelector(".product-title").textContent;
    const productPrice = productBox.querySelector(".price-and-cart .price").textContent;

    // Check if item already exists in the cart
    const cartItems = cartContent.querySelectorAll(".cart-product-title");
    for (let item of cartItems) {
        if (item.textContent === productTitle) {
            alert("This item is already in the cart.");
            return;
        }
    }

    // Create cart box element
    const cartBox = document.createElement("div");
    cartBox.classList.add("cart-box");
    cartBox.innerHTML = `
        <img src="${productImg}" class="cart-img" alt=""> 
        <div class="cart-details">
            <h2 class="cart-product-title">${productTitle}</h2>
            <span class="cart-price">${productPrice}</span>
            <div class="cart-quantity">
                <button class="decrement">-</button>
                <span class="number">1</span>
                <button class="increment">+</button>
            </div>
        </div>
        <i class="ri-delete-bin-line cart-remove"></i>
    `;

    cartContent.appendChild(cartBox);
    
    // Event listener to remove item from cart
    cartBox.querySelector(".cart-remove").addEventListener("click", () => {
        cartBox.remove();
        updateCartCount(-1);
        updateTotalPrice();
    });

    // Event listener for quantity adjustments
    cartBox.querySelector(".cart-quantity").addEventListener("click", event => {
        const numberElement = cartBox.querySelector(".number");
        let quantity = parseInt(numberElement.textContent);

        if (event.target.matches(".decrement") && quantity > 1) {
            quantity--;
        } else if (event.target.matches(".increment")) {
            quantity++;
        }

        numberElement.textContent = quantity;
        updateTotalPrice();
    });

    updateCartCount(1);
    updateTotalPrice();
};

// Function to update total price
const updateTotalPrice = () => {
    const totalPriceElement = document.querySelector(".total-price");
    const cartBoxes = cartContent.querySelectorAll(".cart-box");
    let total = 0;

    cartBoxes.forEach(cartBox => {
        const priceElement = cartBox.querySelector(".cart-price");
        const quantityElement = cartBox.querySelector(".number");
        const price = parseFloat(priceElement.textContent.replace("$", "")) || 0;
        const quantity = parseInt(quantityElement.textContent);
        total += price * quantity;
    });

    totalPriceElement.textContent = `$${total.toFixed(2)}`;
};

// Function to update cart item count
let cartItemCount = 0;
const updateCartCount = change => {
    const cartItemCountBadge = document.querySelector(".cart-item-count");
    cartItemCount += change;
    cartItemCountBadge.style.visibility = cartItemCount > 0 ? "visible" : "hidden";
    cartItemCountBadge.textContent = cartItemCount > 0 ? cartItemCount : "";
};

// Buy Now button
const buyNowButton = document.querySelector(".btn-buy");
buyNowButton.addEventListener("click", () => {
    if (cartContent.querySelectorAll(".cart-box").length === 0) {
        alert("Your cart is empty. Please add items to it before buying.");
        return;
    }
    cartContent.innerHTML = "";
    cartItemCount = 0;
    updateCartCount(0);
    updateTotalPrice();
    alert("Thank you for your purchase!");
});

// Fetch ingredients when page loads
fetchIngredients();