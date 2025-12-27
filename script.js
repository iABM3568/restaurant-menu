// Global variables
let menuItems = [];
let selectedItems = [];
const JSON_URL =
  "https://storage.googleapis.com/acciojob-open-file-collections/appsmith-uploads/bb3807e9b0bc49958d39563eb1759406.json";

// 1. getMenu() - Fetch and display menu items (20 marks)
async function getMenu() {
  try {
    const response = await fetch(JSON_URL);
    menuItems = await response.json();
    displayMenu(menuItems);
  } catch (error) {
    console.error("Error fetching menu:", error);
    document.getElementById("menuGrid").innerHTML =
      "<p>Error loading menu. Please try again.</p>";
  }
}

// Display menu items on the screen
function displayMenu(items) {
  const menuGrid = document.getElementById("menuGrid");
  menuGrid.innerHTML = "";

  items.forEach((item) => {
    const menuCard = document.createElement("div");
    menuCard.className = "menu-item";
    menuCard.innerHTML = `
                    <img src="${item.imgSrc}" alt="${item.name}" class="menu-item-image">
                    <div class="menu-item-info">
                        <div>
                            <div class="menu-item-name">${item.name}</div>
                            <div class="menu-item-price">$${item.price}</div>
                        </div>
                        <button class="add-btn" onclick="addToCart(${item.id})">+</button>
                    </div>
                `;
    menuGrid.appendChild(menuCard);
  });
}

// Add item to cart
function addToCart(itemId) {
  const item = menuItems.find((i) => i.id == itemId);
  if (item) {
    selectedItems.push(item);
    updateCartCount();
    enableOrderButton();
  }
}

// Update cart count
function updateCartCount() {
  document.getElementById("cartCount").textContent = selectedItems.length;
}

// Enable order button when items are added
function enableOrderButton() {
  const orderButton = document.getElementById("orderButton");
  if (selectedItems.length > 0) {
    orderButton.disabled = false;
  }
}

// 2. TakeOrder() - Returns promise, resolves after 2.5s with 3 random burgers (15 marks)
function TakeOrder() {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Get all burger items from menu
      const burgers = menuItems.filter(
        (item) =>
          item.name.toLowerCase().includes("burger") ||
          item.name.toLowerCase().includes("cheese")
      );

      // Select 3 random burgers
      const randomBurgers = [];
      const burgersCopy = [...burgers];

      for (let i = 0; i < 3 && burgersCopy.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * burgersCopy.length);
        randomBurgers.push(burgersCopy[randomIndex]);
        burgersCopy.splice(randomIndex, 1);
      }

      const order = {
        items: randomBurgers,
        timestamp: new Date().toISOString(),
      };

      resolve(order);
    }, 2500);
  });
}

// 3. orderPrep() - Returns promise, resolves after 1.5s (15 marks)
function orderPrep() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        order_status: true,
        paid: false,
      });
    }, 1500);
  });
}

// 4. payOrder() - Returns promise, resolves after 1s (15 marks)
function payOrder() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        order_status: true,
        paid: true,
      });
    }, 1000);
  });
}

// 5. thankyouFnc() - Shows thank you alert (10 marks)
function thankyouFnc() {
  alert("Thank you for eating with us today! 🍔");
}

// Display order items on screen
function displayOrderItems(order) {
  const orderItemsDiv = document.getElementById("orderItems");
  orderItemsDiv.innerHTML = `
                <h3>Your Order</h3>
                ${order.items
                  .map(
                    (item) => `
                    <div class="order-item">
                        <span>${item.name}</span>
                        <span>$${item.price}</span>
                    </div>
                `
                  )
                  .join("")}
                <div class="order-item" style="border-top: 2px solid #ff3b3b; margin-top: 10px; padding-top: 10px; font-weight: bold;">
                    <span>Total</span>
                    <span>$${order.items
                      .reduce((sum, item) => sum + item.price, 0)
                      .toFixed(2)}</span>
                </div>
            `;
}

// Main order flow using async/await (25 marks for proper promise handling)
async function processOrder() {
  try {
    // Hide menu screen, show order screen
    document.getElementById("menuScreen").style.display = "none";
    document.getElementById("orderScreen").classList.add("active");

    // Step 1: Take Order
    document.getElementById("orderStatus").textContent = "Taking your order...";
    const order = await TakeOrder();
    displayOrderItems(order);

    // Step 2: Prepare Order
    document.getElementById("orderStatus").textContent =
      "Preparing your order...";
    const prepStatus = await orderPrep();
    console.log("Order prepared:", prepStatus);

    // Step 3: Payment
    document.getElementById("orderStatus").textContent =
      "Processing payment...";
    const paymentStatus = await payOrder();
    console.log("Payment processed:", paymentStatus);

    // Step 4: Thank you
    if (paymentStatus.paid) {
      document.getElementById("orderStatus").textContent = "Order Complete! ✅";
      document.querySelector(".spinner").style.display = "none";
      setTimeout(() => {
        thankyouFnc();
        // Reset after alert
        location.reload();
      }, 1000);
    }
  } catch (error) {
    console.error("Error processing order:", error);
    alert("There was an error processing your order. Please try again.");
  }
}

// Event Listeners
document.getElementById("orderButton").addEventListener("click", processOrder);

// Search functionality
document.getElementById("searchInput").addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm)
  );
  displayMenu(filteredItems);
});

// Initialize - Load menu on page load
window.addEventListener("DOMContentLoaded", getMenu);
