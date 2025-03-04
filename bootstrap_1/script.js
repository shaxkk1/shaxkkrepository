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

            // Save cart items to localStorage for pickup page
            localStorage.setItem('cartItems', JSON.stringify(cart.items));
            localStorage.setItem('cartTotal', cart.total);
            
            // Redirect to pickup page
            window.location.href = 'pickup.html';
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

    function updateBudgetDisplay(remainingBudget) {
        const budgetDisplay = document.getElementById('budget');
        if (budgetDisplay) {
            budgetDisplay.value = remainingBudget.toFixed(2);  // Format to 2 decimal places
        }
    }

    function updateCartDisplay() {
        // ... existing code ...
        
        // Update totals with 2 decimal places
        document.getElementById('subtotal').textContent = subtotal.toFixed(2);
        document.getElementById('tax').textContent = tax.toFixed(2);
        document.getElementById('total').textContent = total.toFixed(2);
        
        // Update budget if set
        if (budget !== null) {
            const remainingBudget = budget - total;
            updateBudgetDisplay(remainingBudget);
        }
    }

    // Add pickup form handling
    if (document.getElementById('pickupForm')) {
        // Set minimum date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.getElementById('pickupDate').min = tomorrow.toISOString().split('T')[0];

        // Display order summary
        const orderSummary = document.getElementById('orderSummary');
        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        const cartTotal = parseFloat(localStorage.getItem('cartTotal') || '0');

        let summaryHTML = '<ul class="list-unstyled">';
        cartItems.forEach(item => {
            summaryHTML += `<li>${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>`;
        });
        summaryHTML += `</ul><hr><strong>Total: $${cartTotal.toFixed(2)}</strong>`;
        orderSummary.innerHTML = summaryHTML;

        // Handle form submission
        document.getElementById('pickupForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const pickupDetails = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                date: document.getElementById('pickupDate').value,
                time: document.getElementById('pickupTime').value,
                items: cartItems,
                total: cartTotal
            };

            // You could send this to a server, for now we'll just show a confirmation
            alert(`Thank you ${pickupDetails.name}! Your order is scheduled for pickup on ${pickupDetails.date} at ${pickupDetails.time}. We will send a confirmation to your phone number ${pickupDetails.phone}.`);
            
            // Clear cart and storage
            localStorage.removeItem('cartItems');
            localStorage.removeItem('cartTotal');
            
            // Redirect to home page
            window.location.href = 'index.html';
        });
    }

    // Update the products object with correct image links
    const products = {
        fresh: [
            { name: 'Ground Pork', price: 4.99, image: 'https://www.olgainthekitchen.com/wp-content/uploads/2017/06/DSC_0896.jpg' },
            { name: 'Chicken Thighs', price: 3.99, image: 'https://theyumyumclub.com/wp-content/uploads/2019/02/CCT-1.jpg' },
            { name: 'Pork Belly', price: 6.99, image: 'https://kwokspots.com/wp-content/uploads/2024/08/crispy-pork-bellyl-2.png' },
            { name: 'Beef Chuck', price: 7.99, image: 'https://bakeitwithlove.com/wp-content/uploads/2023/01/What-Is-Chuck-Steak-sq.jpg' },
            { name: 'Chicken Wings', price: 3.49, image: 'https://www.loveandotherspices.com/wp-content/uploads/2023/06/air-fryer-bbq-chicken-wings-featured.jpg' }
        ],
        noodles: [
            { name: 'Udon Noodles', price: 2.99, image: 'https://sudachirecipes.com/wp-content/uploads/2025/02/beef-niku-udon-thumb.png' },
            { name: 'Rice Noodles', price: 1.99, image: 'https://ingoodflavor.com/wp-content/uploads/2023/03/SlowCookerChickenVermicelliSoup-IMG_6286Feat.jpg' },
            { name: 'Ramen Noodles', price: 2.49, image: 'https://sudachirecipes.com/wp-content/uploads/2022/09/shoyu-ramen-sq.jpg' },
            { name: 'Soba Noodles', price: 3.49, image: 'https://tiffycooks.com/wp-content/uploads/2020/11/FullSizeRender-258-scaled.jpg' }
        ],
        sauces: [
            { name: 'Soy Sauce', price: 3.99, image: 'https://m.media-amazon.com/images/I/71zI-cIBeUS.jpg' },
            { name: 'Oyster Sauce', price: 4.99, image: 'https://m.media-amazon.com/images/I/71LYLrbJs-L.jpg' },
            { name: 'Hoisin Sauce', price: 3.99, image: 'https://cdn-akamai.lkk.com/-/media/hoisin---front-crop.png?h=1080&w=784&hash=AC290FEF9424E001718B6B71D14F8981' },
            { name: 'Sriracha Sauce', price: 2.99, image: 'https://m.media-amazon.com/images/I/61zVOmtHZhL.jpg' }
        ],
        snacks: [
            { name: 'Hi-Chew Candy', price: 2.49, image: 'https://www.hi-chew.com/cdn/shop/files/FantasyMixPage4.png?v=1722349047&width=1445' },
            { name: 'Yan Yan', price: 1.99, image: 'https://m.media-amazon.com/images/I/510sSFk4SUL._AC_UF1000,1000_QL80_.jpg' },
            { name: 'Japanese Mochi', price: 4.99, image: 'https://www.wandercooks.com/wp-content/uploads/2022/10/daifuku-mochi-recipe-ft-1.jpg' },
            { name: 'Want Want Rice Crackers', price: 2.99, image: 'https://i.ebayimg.com/images/g/5dgAAOSwU8hY7cRo/s-l400.jpg' },
            { name: 'Haw Flakes', price: 1.49, image: 'https://www.snackhawaii.com/cdn/shop/products/Haw_Flakes_b1676630-1ba7-4cfa-a456-39dda9c43d37_934x700.JPG?v=1570222767' },
            { name: 'Lotte Pepero', price: 2.49, image: 'https://m.media-amazon.com/images/I/51vJUSs6pIL.jpg' }
        ],
        desserts: [
            { name: 'Matcha Ice Cream', price: 5.99, image: 'https://whatgreatgrandmaate.com/wp-content/uploads/2023/07/matcha-ice-cream-sq.jpg' },
            { name: 'Red Bean Buns', price: 3.99, image: 'https://thewoksoflife.com/wp-content/uploads/2020/11/red-bean-buns-13.jpg' },
            { name: 'Egg Custard Tarts', price: 4.99, image: 'https://omnivorescookbook.com/wp-content/uploads/2021/04/200918_Hong-Kong-Egg-Tart_550.jpg' },
            { name: 'Mango Pudding', price: 3.49, image: 'https://tiffycooks.com/wp-content/uploads/2021/07/Screen-Shot-2021-07-26-at-12.37.36-AM.png' },
            { name: 'Sesame Balls', price: 4.49, image: 'https://cdn.apartmenttherapy.info/image/upload/f_auto,q_auto:eco,c_fill,g_auto,w_1500,ar_3:2/k%2FPhoto%2FRecipe%20Ramp%20Up%2F2021-12-Sesame-Balls%2Fimage' },
            { name: 'Mochi Ice Cream Variety Pack', price: 8.99, image: 'https://www.mashed.com/img/gallery/these-mochi-ice-cream-boxes-have-costco-shoppers-divided/l-intro-1631713480.jpg' },
            { name: 'Red Bean Mochi Ice Cream', price: 7.99, image: 'https://www.mikawayamochi.com/wp-content/uploads/2020/06/042820-Mika-RedBean-3D-350x455-1.png' },
            { name: 'Black Sesame Mochi Ice Cream', price: 7.99, image: 'https://www.mikawayamochi.com/wp-content/uploads/2020/06/042820-Mika-BlackSesame-3D-350x455-1.png' },
            { name: 'Traditional Lotus Mooncake', price: 6.99, image: 'https://images.squarespace-cdn.com/content/v1/62bf67c4d370c33d137d8f5c/58dad562-61aa-4ad0-9920-20a00e6029d6/Classic+lotus+seed+paste+filling+mooncakes.jpg' },
            { name: 'Red Bean Mooncake', price: 5.99, image: 'https://thewoksoflife.com/wp-content/uploads/2022/09/classic-mooncakes-red-bean-24.jpg' },
            { name: 'Premium Mooncake Gift Box', price: 29.99, image: 'https://i0.wp.com/mooncakemarketplace.com/wp-content/uploads/2024/08/Premium-Box-Promotion.jpg?fit=575%2C370&ssl=1' },
            { name: 'Snow Skin Mooncake', price: 7.99, image: 'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2023/7/17/fnk_SNOW_SKIN_MOONCAKES_s4x3.jpg.rend.hgtvcom.1280.960.suffix/1689609653320.webp' }
        ]
    };

    // Add to existing script.js
    if (document.getElementById('categorySelect')) {
        document.getElementById('categorySelect').addEventListener('change', function() {
            const category = this.value;
            const productList = document.getElementById('productList');
            productList.innerHTML = '';

            if (category && products[category]) {
                products[category].forEach(product => {
                    const productCard = `
                        <div class="col-md-4">
                            <div class="card h-100">
                                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                                <div class="card-body">
                                    <h5 class="card-title">${product.name}</h5>
                                    <p class="text-danger fw-bold">$${product.price.toFixed(2)}</p>
                                    <div class="d-flex align-items-center">
                                        <input type="number" class="form-control me-2" value="1" min="1" style="width: 70px;">
                                        <button class="btn btn-danger add-to-pickup" 
                                                data-name="${product.name}" 
                                                data-price="${product.price}">
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    productList.innerHTML += productCard;
                });

                // Add event listeners to new Add buttons
                document.querySelectorAll('.add-to-pickup').forEach(button => {
                    button.addEventListener('click', function() {
                        const quantity = parseInt(this.parentElement.querySelector('input').value);
                        const name = this.dataset.name;
                        const price = parseFloat(this.dataset.price);
                        const budget = parseFloat(localStorage.getItem('budget') || '0');

                        // Calculate new total
                        const currentTotal = parseFloat(localStorage.getItem('cartTotal') || '0');
                        const newTotal = currentTotal + (price * quantity);

                        // Check budget if set
                        if (budget > 0 && newTotal > budget) {
                            if (!confirm(`This will exceed your budget by $${(newTotal - budget).toFixed(2)}. Do you want to continue?`)) {
                                return;
                            }
                        }

                        // Get existing cart items
                        let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

                        // Add new item
                        cartItems.push({
                            name: name,
                            price: price,
                            quantity: quantity
                        });

                        // Save updated cart
                        localStorage.setItem('cartItems', JSON.stringify(cartItems));
                        localStorage.setItem('cartTotal', newTotal.toString());

                        // Update order summary
                        updateOrderSummary();

                        alert(`Added ${quantity} ${name} to your order!`);
                    });
                });
            }
        });
    }

    function updateOrderSummary() {
        const orderSummary = document.getElementById('orderSummary');
        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        const cartTotal = parseFloat(localStorage.getItem('cartTotal') || '0');

        let summaryHTML = '<ul class="list-unstyled">';
        cartItems.forEach(item => {
            summaryHTML += `<li>${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>`;
        });
        summaryHTML += `</ul><hr><strong>Total: $${cartTotal.toFixed(2)}</strong>`;
        orderSummary.innerHTML = summaryHTML;
        
        // Update budget display
        updateBudgetWithPickup();
    }

    // Call this when page loads if we're on pickup page
    if (document.getElementById('orderSummary')) {
        updateOrderSummary();
    }

    function updateBudgetWithPickup() {
        const budget = parseFloat(localStorage.getItem('budget') || '0');
        const cartTotal = parseFloat(localStorage.getItem('cartTotal') || '0');
        
        if (budget > 0) {
            const remainingBudget = budget - cartTotal;
            const budgetInput = document.getElementById('budget');
            if (budgetInput) {
                budgetInput.value = remainingBudget.toFixed(2);
            }
            
            // Add budget warning if exceeded
            const orderSummary = document.getElementById('orderSummary');
            if (orderSummary) {
                if (remainingBudget < 0) {
                    orderSummary.innerHTML += `
                        <div class="alert alert-danger mt-3">
                            Warning: Order total exceeds budget by $${Math.abs(remainingBudget).toFixed(2)}
                        </div>`;
                } else {
                    orderSummary.innerHTML += `
                        <div class="alert alert-success mt-3">
                            Remaining Budget: $${remainingBudget.toFixed(2)}
                        </div>`;
                }
            }
        }
    }

    // Add budget input handler for pickup page
    if (document.getElementById('budget')) {
        document.getElementById('budget').addEventListener('change', function() {
            const newBudget = parseFloat(this.value) || 0;
            localStorage.setItem('budget', newBudget.toString());
            updateOrderSummary();
        });
    }

    // Add phone number formatting and validation
    if (document.getElementById('phone')) {
        const phoneInput = document.getElementById('phone');
        
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = `(${value}`;
                } else if (value.length <= 6) {
                    value = `(${value.slice(0,3)})-${value.slice(3)}`;
                } else {
                    value = `(${value.slice(0,3)})-${value.slice(3,6)}-${value.slice(6,10)}`;
                }
            }
            e.target.value = value;
        });

        // Validate on form submission
        document.getElementById('pickupForm').addEventListener('submit', function(e) {
            const phoneRegex = /^\(\d{3}\)-\d{3}-\d{4}$/;
            const phoneNumber = phoneInput.value;
            
            if (!phoneRegex.test(phoneNumber)) {
                e.preventDefault();
                phoneInput.classList.add('is-invalid');
                return false;
            } else {
                phoneInput.classList.remove('is-invalid');
                phoneInput.classList.add('is-valid');
            }
        });

        // Clear invalid state when user starts typing
        phoneInput.addEventListener('focus', function() {
            this.classList.remove('is-invalid');
        });
    }

    // Add Gallery link to navbar
    const galleryLink = document.createElement('li');
    galleryLink.className = 'nav-item';
    galleryLink.innerHTML = `
        <a class="nav-link" href="gallery.html">Gallery</a>
    `;
    navbar.appendChild(galleryLink);
}); 