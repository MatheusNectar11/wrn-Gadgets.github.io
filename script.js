// Load products from the JSON file and store them in localStorage
async function loadProducts() {
    try {
        const response = await fetch("products.json");
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const products = await response.json();

        // Add stock levels to products if they don't exist
        products.forEach(product => {
            if (product.stock === undefined) {
                product.stock = 10; // Default stock level
            }
        });

        localStorage.setItem("products", JSON.stringify(products));
        displayProducts(products);
    } catch (error) {
        console.error("Error loading products:", error);
    }
}

// Display products in the product list
function displayProducts(products) {
    const productList = document.getElementById("product-list");
    const searchValue = document.getElementById("search").value.toLowerCase();
    const categoryValue = document.getElementById("category").value;
    productList.innerHTML = "";

    products
        .filter(
            (p) =>
                p.name.toLowerCase().includes(searchValue) &&
                (categoryValue === "" || p.category === categoryValue)
        )
        .forEach((product) => {
            productList.innerHTML += `
                <div class="product">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p class="description">${product.description}</p>
                    <p class="price">Price: N$${product.price}</p>
                    <p class="stock">Stock: ${product.stock} available</p>
                    <button onclick="addToCart(${product.id})" ${product.stock === 0 ? "disabled" : ""}>
                        ${product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                </div>
            `;
        });
}

// Add a product to the cart and update stock
function addToCart(productId) {
    let cart = getCart();
    let products = JSON.parse(localStorage.getItem("products"));
    let product = products.find((p) => p.id === productId);

    if (product.stock > 0) {
        const existingProduct = cart.find((item) => item.id === productId);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        // Reduce stock
        product.stock -= 1;

        setCart(cart);
        localStorage.setItem("products", JSON.stringify(products));
        updateCartDisplay();
        displayProducts(products); // Refresh UI
    } else {
        alert("This product is out of stock!");
    }
}

// Retrieve the cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save the cart to localStorage
function setCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Update the cart modal display
function updateCartDisplay() {
    const cart = getCart();
    const cartToggle = document.getElementById("cart-toggle");
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    cartToggle.textContent = `Cart (${cart.length})`;

    let total = 0;
    cartItems.innerHTML = "";
    cart.forEach((item) => {
        total += item.price * item.quantity;
        cartItems.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image" />
                <div class="cart-item-name">${item.name} x ${item.quantity}</div>
                <div class="cart-item-price">N$${(item.price * item.quantity).toFixed(2)}</div>
                <button class="increase-item" onclick="changeItemQuantity(${item.id}, 1)">+</button>
                <button class="decrease-item" onclick="changeItemQuantity(${item.id}, -1)">-</button>
                <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
    });

    cartTotal.textContent = `Total: N$${total.toFixed(2)}`;
    document.getElementById("checkout-btn").disabled = cart.length === 0;
}

// Change item quantity in cart
function changeItemQuantity(productId, change) {
    let cart = getCart();
    let products = JSON.parse(localStorage.getItem("products"));
    let product = products.find((p) => p.id === productId);
    let cartItem = cart.find((item) => item.id === productId);

    if (cartItem) {
        if (change > 0 && product.stock > 0) {
            cartItem.quantity += 1;
            product.stock -= 1;
        } else if (change < 0) {
            cartItem.quantity -= 1;
            product.stock += 1;
            if (cartItem.quantity <= 0) {
                cart = cart.filter((item) => item.id !== productId);
            }
        }
    }

    setCart(cart);
    localStorage.setItem("products", JSON.stringify(products));
    updateCartDisplay();
    displayProducts(products);
}

// Remove a product from the cart and restock
function removeFromCart(productId) {
    let cart = getCart();
    let products = JSON.parse(localStorage.getItem("products"));
    let product = products.find((p) => p.id === productId);
    let cartItem = cart.find((item) => item.id === productId);

    if (cartItem) {
        product.stock += cartItem.quantity;
    }

    cart = cart.filter((item) => item.id !== productId);
    setCart(cart);
    localStorage.setItem("products", JSON.stringify(products));
    updateCartDisplay();
    displayProducts(products);
}

// Proceed to checkout and clear cart
function proceedToCheckout() {
    let cart = getCart();
    if (cart.length === 0) {
        alert("Your cart is empty! Please add items before proceeding.");
        return;
    }

    alert("Checkout successful!");
    setCart([]);
    updateCartDisplay();
}

// Toggle cart modal visibility
function toggleCart() {
    const cartModal = document.getElementById("cart-modal");
    cartModal.style.display = cartModal.style.display === "flex" ? "none" : "flex";
}

// Close the cart modal
function closeCart() {
    document.getElementById("cart-modal").style.display = "none";
}

// Search and filter
document.getElementById("search").addEventListener("input", () => {
    const products = JSON.parse(localStorage.getItem("products"));
    displayProducts(products);
});

document.getElementById("category").addEventListener("change", () => {
    const products = JSON.parse(localStorage.getItem("products"));
    displayProducts(products);
});

// Load products on page load
window.onload = loadProducts;