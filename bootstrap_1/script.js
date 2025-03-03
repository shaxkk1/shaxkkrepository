// JavaScript for Asian Food Market

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage or create new cart
    let cart = JSON.parse(localStorage.getItem('cart')) || {
        items: [],
        total: 0,
        budget: parseFloat(localStorage.getItem('budget')) || 0
    };

    // Update budget input with stored value
    const budgetInput = document.getElementById('budget');
    if (budgetInput) {
        budgetInput.value = cart.budget;
        budgetInput.addEventListener('change', function() {
            cart.budget = parseFloat(this.value) || 0;
            localStorage.setItem('budget', cart.budget);
            updateCart();
            checkBudgetStatus();
        });
    }

    // Create cart icon in navbar if it doesn't exist
    const navbar = document.querySelector('.navbar-nav');
    const cartElement = document.createElement('li');
    cartElement.className = 'nav-item';
    cartElement.innerHTML = `
        <a class="nav-link" href="#" id="cartCounter">
            Cart (0)
            <span class="badge bg-warning text-dark rounded-pill ms-1">0</span>
        </a>
    `;
    navbar.appendChild(cartElement);

    // Add to cart functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const card = e.target.closest('.card');
            const name = e.target.dataset.name;
            const price = parseFloat(e.target.dataset.price);
            const quantity = parseInt(card.querySelector('input[type="number"]').value);
            
            addToCart(name, price, quantity);
        }
    });

    function addToCart(name, price, quantity) {
        const totalPrice = price * quantity;
        const tax = (cart.total + totalPrice) * 0.08;
        const finalTotal = (cart.total + totalPrice + tax);
        
        // Check budget before adding
        if (cart.budget > 0 && finalTotal > cart.budget) {
            showNotification('Cannot add item: Would exceed budget of $' + cart.budget.toFixed(2), 'warning');
            return;
        }

        // Add or update item in cart
        const existingItem = cart.items.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ name, price, quantity });
        }

        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        updateCart();
        showNotification(`Added ${quantity} ${name} to cart`);
    }

    function updateCart() {
        // Calculate total and item count
        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        
        // Update cart button text in navbar
        const cartButton = document.querySelector('[data-bs-toggle="offcanvas"]');
        if (cartButton) {
            cartButton.innerHTML = `
                Cart (${itemCount})
                <span class="ms-2">$${cart.total.toFixed(2)}</span>
            `;
        }

        // Also update the separate counter if it exists
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = itemCount;
        }

        // Update cart total if it exists separately
        const cartTotal = document.getElementById('cartTotal');
        if (cartTotal) {
            cartTotal.textContent = cart.total.toFixed(2);
        }
        
        // Update cart items display
        const cartItems = document.getElementById('cartItems');
        if (cartItems) {
            cartItems.innerHTML = cart.items.map(item => `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <div>
                        ${item.name} x ${item.quantity}
                        <button class="btn btn-sm btn-danger ms-2" onclick="removeFromCart('${item.name}')">Remove</button>
                    </div>
                    <div>$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `).join('');

            const tax = cart.total * 0.08;
            const finalTotal = cart.total + tax;
            
            // Update subtotal, tax, and total
            document.getElementById('subtotal').textContent = cart.total.toFixed(2);
            document.getElementById('tax').textContent = tax.toFixed(2);
            document.getElementById('total').textContent = finalTotal.toFixed(2);

            // Check budget status
            const checkoutBtn = document.getElementById('checkoutBtn');
            if (checkoutBtn) {
                if (cart.budget > 0 && finalTotal > cart.budget) {
                    checkoutBtn.disabled = true;
                    checkoutBtn.classList.remove('btn-success');
                    checkoutBtn.classList.add('btn-secondary');
                    checkoutBtn.innerHTML = `Cannot Checkout: Over Budget by $${(finalTotal - cart.budget).toFixed(2)}`;
                } else {
                    checkoutBtn.disabled = false;
                    checkoutBtn.classList.remove('btn-secondary');
                    checkoutBtn.classList.add('btn-success');
                    checkoutBtn.innerHTML = 'Proceed to Checkout';
                }
            }
        }

        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Remove from cart
    window.removeFromCart = function(name) {
        cart.items = cart.items.filter(item => item.name !== name);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
        showNotification(`Removed ${name} from cart`);
    };

    // Checkout handler
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.items.length === 0) {
                showNotification('Your cart is empty!', 'warning');
                return;
            }
            
            const finalTotal = cart.total + (cart.total * 0.08);
            if (cart.budget > 0 && finalTotal > cart.budget) {
                showNotification(`Cannot checkout: Over budget by $${(finalTotal - cart.budget).toFixed(2)}!`, 'error');
                return;
            }

            // Get current budget and subtract the total with tax
            const currentBudget = parseFloat(cart.budget);
            const remainingBudget = currentBudget - finalTotal;
            
            // Update budget
            cart.budget = remainingBudget;
            localStorage.setItem('budget', remainingBudget);

            // Update budget input display
            const budgetInput = document.getElementById('budget');
            if (budgetInput) {
                budgetInput.value = remainingBudget.toFixed(2);
            }

            // Clear cart
            cart.items = [];
            cart.total = 0;
            localStorage.setItem('cart', JSON.stringify(cart));

            // Reset all quantity inputs to 1
            document.querySelectorAll('input[type="number"]').forEach(input => {
                input.value = 1;
            });

            // Update cart display
            updateCart();
            showNotification(`Order placed! Remaining budget: $${remainingBudget.toFixed(2)}`, 'success');
        });
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
        notification.style.zIndex = '1050';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 3000);
    }

    // Shop Now button functionality
    const shopNowBtn = document.querySelector('.btn-danger.btn-lg');
    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const featuredSection = document.querySelector('#featured-categories');
            if (featuredSection) {
                featuredSection.scrollIntoView({ behavior: 'smooth' });
            }
            showNotification('Welcome to our shop!');
        });
    }

    // Navigation smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add CSS animation for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Price formatter
    function formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    }

    // Error handling
    window.addEventListener('error', function(e) {
        console.error('An error occurred:', e.error);
        showNotification('Something went wrong. Please try again.');
    });

    // Initialize cart display on page load
    updateCart();
}); 