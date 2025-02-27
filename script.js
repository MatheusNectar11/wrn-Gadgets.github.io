// Load products from the JSON file and store them in localStorage
async function loadProducts() {
    try {
      const response = await fetch("products.json");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const products = await response.json();
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
            <button onclick="addToCart(${product.id})">Add to Cart</button>
          </div>
        `;
      });
  }
  
  // Add a product to the cart
  function addToCart(productId) {
    let cart = getCart();
    const products = JSON.parse(localStorage.getItem("products"));
    const product = products.find((p) => p.id === productId);
    const existingProduct = cart.find((item) => item.id === productId);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    setCart(cart);
    updateCartDisplay();
  }
  
  // Retrieve the cart from localStorage
  function getCart() {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
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
  
    // Update the cart button count
    cartToggle.textContent = `Cart (${cart.length})`;
  
    // Update cart items and total
    let total = 0;
    cartItems.innerHTML = "";
    cart.forEach((item) => {
      total += item.price * item.quantity;
      cartItems.innerHTML += `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image" />
          <div class="cart-item-name">${item.name} x ${item.quantity}</div>
          <div class="cart-item-price">N$${(item.price * item.quantity).toFixed(2)}</div>
          <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
          <button class="increase-item" onclick="changeItemQuantity(${item.id}, 1)">+</button>
          <button class="decrease-item" onclick="changeItemQuantity(${item.id}, -1)">-</button>
        </div>
      `;
    });
    cartTotal.textContent = `Total: N$${total.toFixed(2)}`;
  
    // Enable or disable checkout button based on cart content
    document.getElementById("checkout-btn").disabled = cart.length === 0;
  }
  
  // Remove a product from the cart
  function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter((item) => item.id !== productId);
    setCart(cart);
    updateCartDisplay();
  }
  
  // Change the quantity of a product in the cart (increase or decrease)
  function changeItemQuantity(productId, change) {
    let cart = getCart();
    const product = cart.find((item) => item.id === productId);
    if (product) {
      product.quantity += change;
      if (product.quantity <= 0) {
        removeFromCart(productId);
      } else {
        setCart(cart);
        updateCartDisplay();
      }
    }
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
  
  // Proceed to checkout
  function proceedToCheckout() {
    const cart = getCart();
    if (cart.length === 0) {
      alert("Your cart is empty! Please add items before proceeding.");
      return;
    }
    // Placeholder for checkout process
    alert("Proceeding to checkout...");
  }
  
  // Event listeners for search and category filters
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