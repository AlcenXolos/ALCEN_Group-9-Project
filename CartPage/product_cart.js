document.addEventListener("DOMContentLoaded", loadCart);

document.getElementById("checkout-btn").addEventListener("click", populateCheckoutItems);

function loadCart() {
    let currentUser = JSON.parse(localStorage.getItem("user"));

    if (!currentUser || !currentUser.cart || currentUser.cart.length === 0) {
        document.getElementById("cart-items").innerHTML = '<li class="list-group-item text-center">Your cart is empty.</li>';
        document.getElementById("cart-count").textContent = "0";
        document.getElementById("cart-total").textContent = "0.00";
        document.getElementById("checkout-btn").disabled = true;
        return;
    }

    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("checkout-btn");

    cartItems.innerHTML = ""; 
    let totalPrice = 0;
    let totalQuantity = 0;

    currentUser.cart.forEach((item, index) => {
        const li = document.createElement("li");
        li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

        li.innerHTML = `
            <img src="${item.img}" alt="${item.name}" class="img-thumbnail me-3" style="width: 50px; height: 50px;">
            <span><strong>${item.name}</strong> - $${item.price} x ${item.quantity}</span>
            <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Remove</button>
        `;

        cartItems.appendChild(li);
        totalPrice += item.price * item.quantity;
        totalQuantity += item.quantity;
    });

    cartCount.textContent = totalQuantity;
    cartTotal.textContent = totalPrice.toFixed(2);
    checkoutBtn.disabled = false;
}

function removeFromCart(index) {
    let currentUser = JSON.parse(localStorage.getItem("user"));

    if (!currentUser || !currentUser.cart) return;

    currentUser.cart.splice(index, 1);
    localStorage.setItem("user", JSON.stringify(currentUser));

    loadCart();
}

// Function to populate checkout items in the modal and update the total amount
function populateCheckoutItems() {
    let currentUser = JSON.parse(localStorage.getItem("user"));

    if (!currentUser || !currentUser.cart || currentUser.cart.length === 0) {
        document.getElementById("checkout-modal-total").textContent = "$0.00";
        return;
    }

    const checkoutTotal = document.getElementById("checkout-modal-total");
    let totalPrice = 0;

    currentUser.cart.forEach(item => {
        totalPrice += item.price * item.quantity;
    });

    checkoutTotal.textContent = `$${totalPrice.toFixed(2)}`;
}

// Function to process payment, validate the form fields, clear the cart and close the modal
function processPayment() {
    const cardHolder = document.getElementById('card-holder').value;
    const cardNumber = document.getElementById('card-number').value;
    const expirationDate = document.getElementById('expiration-date').value;
    const cvc = document.getElementById('cvc').value;

    if (cardHolder && cardNumber && expirationDate && cvc) {
        alert('Payment processed successfully!');
        
        // Clear the cart
        let currentUser = JSON.parse(localStorage.getItem("user"));
        currentUser.cart = [];
        localStorage.setItem("user", JSON.stringify(currentUser));

        // Refresh the cart display
        loadCart();

        // Close the modal
        const checkoutModal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
        checkoutModal.hide();
    } else {
        alert('Please fill in all the fields.');
    }
}
