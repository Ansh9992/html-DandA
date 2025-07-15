// Application state
const cart = {
    labours: 0,
    architect: 0,
    interior: 0,
    bricks: 0,
    cement: 0,
    sand: 0,
    aggregate: 0,
    granite: "",
    graniteQty: 0,
    iron: 0
};

// Price list
const priceList = {
    labour: 800,
    architect: 5000,
    interior: 4500,
    bricks: 7,
    cement: 360,
    sand: 55,
    aggregate: 50,
    granite: 150,
    iron: 65
};

// Global variables
let currentModalType = '';
let selectedGraniteType = '';

// Modal functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Cart management
function updateCartSummary() {
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const cartSummary = document.getElementById('cart-summary');
    
    if (!cartCount || !cartTotal || !cartSummary) return;
    
    let totalItems = 0;
    let totalPrice = 0;
    
    // Count items and calculate total
    Object.keys(cart).forEach(key => {
        if (key === 'granite' || cart[key] === 0) return;
        
        if (key === 'graniteQty') {
            totalItems += cart[key];
            totalPrice += cart[key] * priceList.granite;
        } else {
            totalItems += cart[key];
            totalPrice += cart[key] * priceList[key];
        }
    });
    
    cartCount.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
    cartTotal.textContent = `₹${totalPrice.toLocaleString()}`;
    
    if (totalItems > 0) {
        cartSummary.classList.add('active');
    } else {
        cartSummary.classList.remove('active');
    }
}

// Success message
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #5ab6ff, #21808d);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
        backdrop-filter: blur(12px);
        z-index: 3000;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        successDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(successDiv)) {
                document.body.removeChild(successDiv);
            }
        }, 300);
    }, 3000);
}

// Error message
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(192, 21, 47, 0.9);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(192, 21, 47, 0.3);
        backdrop-filter: blur(12px);
        z-index: 3000;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        errorDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(errorDiv)) {
                document.body.removeChild(errorDiv);
            }
        }, 300);
    }, 3000);
}

// Quantity modal functions
function showQuantityModal(type) {
    const modalTitle = document.getElementById('modal-title');
    const quantityInput = document.getElementById('quantity-input');
    
    if (!modalTitle || !quantityInput) return;
    
    let title = '';
    switch(type) {
        case 'labour':
            title = 'How many labours do you need?';
            break;
        case 'architect':
            title = 'How many architects do you need?';
            break;
        case 'interior':
            title = 'How many interior designers do you need?';
            break;
        case 'bricks':
            title = 'How many bricks do you need?';
            break;
        case 'cement':
            title = 'How many cement bags do you need?';
            break;
        case 'sand':
            title = 'How much sand do you need? (cubic ft)';
            break;
        case 'aggregate':
            title = 'How much aggregate do you need? (cubic ft)';
            break;
        case 'iron':
            title = 'How much TMT iron do you need? (kg)';
            break;
    }
    
    modalTitle.textContent = title;
    quantityInput.value = 1;
    currentModalType = type;
    showModal('quantity-modal');
}

// Materials page functions
function showMaterialsPage() {
    const materialsPage = document.getElementById('materials-page');
    if (materialsPage) {
        materialsPage.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function hideMaterialsPage() {
    const materialsPage = document.getElementById('materials-page');
    if (materialsPage) {
        materialsPage.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Granite modal functions
function showGraniteModal() {
    // Reset selection
    document.querySelectorAll('.granite-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    const graniteQty = document.getElementById('granite-qty');
    if (graniteQty) graniteQty.value = 1;
    selectedGraniteType = '';
    showModal('granite-modal');
}

// Checkout modal functions
function showCheckoutModal() {
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutSubtotal = document.getElementById('checkout-subtotal');
    const checkoutTotal = document.getElementById('checkout-total');
    
    if (!checkoutItems || !checkoutSubtotal || !checkoutTotal) return;
    
    let itemsHTML = '';
    let subtotal = 0;
    
    Object.keys(cart).forEach(key => {
        if (key === 'granite' || cart[key] === 0) return;
        
        let itemName = key;
        let quantity = cart[key];
        let price = 0;
        
        if (key === 'graniteQty') {
            itemName = `${cart.granite} granite`;
            price = quantity * priceList.granite;
        } else {
            price = quantity * priceList[key];
        }
        
        subtotal += price;
        
        itemsHTML += `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>${quantity}x ${itemName}</span>
                <span>₹${price.toLocaleString()}</span>
            </div>
        `;
    });
    
    checkoutItems.innerHTML = itemsHTML;
    checkoutSubtotal.textContent = `₹${subtotal.toLocaleString()}`;
    checkoutTotal.textContent = `₹${subtotal.toLocaleString()}`;
    
    showModal('checkout-modal');
}

// Animation functions
function initializeObservers() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // Animate stats counter
                if (entry.target.classList.contains('stats-section')) {
                    animateStats();
                }
                
                // Animate features list
                if (entry.target.classList.contains('why-use-section')) {
                    animateFeaturesList();
                }
            } else {
                entry.target.classList.remove('in-view');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(el => observer.observe(el));
    
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => observer.observe(section));
}

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        let current = 0;
        const increment = target / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (stat.textContent.includes('+')) {
                stat.textContent = Math.floor(current) + '+';
            } else {
                stat.textContent = Math.floor(current);
            }
        }, 40);
    });
}

function animateFeaturesList() {
    const features = document.querySelectorAll('.features-list li');
    features.forEach((feature, index) => {
        setTimeout(() => {
            feature.classList.add('in-view');
        }, index * 150);
    });
}

// Helper function to check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart summary
    updateCartSummary();
    
    // Initialize observers
    initializeObservers();
    
    // Show disclaimer modal on load
    showModal('disclaimer-modal');
    
    // CRITICAL FIX: Disclaimer modal handler - multiple event binding approaches
    function handleEnterSite() {
        hideModal('disclaimer-modal');
        showSuccessMessage('Welcome to D&A Constructions!');
    }
    
    const enterSiteBtn = document.getElementById('enter-site');
    if (enterSiteBtn) {
        // Remove any existing listeners
        enterSiteBtn.replaceWith(enterSiteBtn.cloneNode(true));
        const newEnterSiteBtn = document.getElementById('enter-site');
        
        // Add multiple event listeners for better compatibility
        newEnterSiteBtn.addEventListener('click', handleEnterSite);
        newEnterSiteBtn.addEventListener('mousedown', handleEnterSite);
        newEnterSiteBtn.addEventListener('touchstart', handleEnterSite);
        
        // Also add keyboard support
        newEnterSiteBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleEnterSite();
            }
        });
    }
    
    // Action button handlers
    document.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const action = btn.getAttribute('data-action');
            
            if (action === 'materials') {
                showMaterialsPage();
            } else {
                showQuantityModal(action);
            }
        });
    });
    
    // Material button handlers
    document.querySelectorAll('[data-material]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const material = btn.getAttribute('data-material');
            
            if (material === 'granite') {
                showGraniteModal();
            } else {
                showQuantityModal(material);
            }
        });
    });
    
    // Back to main button
    const backToMainBtn = document.getElementById('back-to-main');
    if (backToMainBtn) {
        backToMainBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            hideMaterialsPage();
        });
    }
    
    // Quantity modal handlers
    const modalCancel = document.getElementById('modal-cancel');
    const modalConfirm = document.getElementById('modal-confirm');
    
    if (modalCancel) {
        modalCancel.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            hideModal('quantity-modal');
        });
    }
    
    if (modalConfirm) {
        modalConfirm.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const quantityInput = document.getElementById('quantity-input');
            const quantity = quantityInput ? parseInt(quantityInput.value) : 0;
            
            if (quantity > 0 && currentModalType) {
                cart[currentModalType] += quantity;
                updateCartSummary();
                hideModal('quantity-modal');
                
                showSuccessMessage(`Added ${quantity} ${currentModalType} to cart!`);
                
                // If materials page is active, go back to main
                const materialsPage = document.getElementById('materials-page');
                if (materialsPage && materialsPage.classList.contains('active')) {
                    setTimeout(() => {
                        hideMaterialsPage();
                    }, 1000);
                }
            }
        });
    }
    
    // Granite modal handlers
    const graniteCancel = document.getElementById('granite-cancel');
    const graniteConfirm = document.getElementById('granite-confirm');
    
    if (graniteCancel) {
        graniteCancel.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            hideModal('granite-modal');
        });
    }
    
    if (graniteConfirm) {
        graniteConfirm.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const graniteQty = document.getElementById('granite-qty');
            const quantity = graniteQty ? parseInt(graniteQty.value) : 0;
            
            if (selectedGraniteType && quantity > 0) {
                cart.granite = selectedGraniteType;
                cart.graniteQty += quantity;
                updateCartSummary();
                hideModal('granite-modal');
                
                showSuccessMessage(`Added ${quantity} sq ft of ${selectedGraniteType} granite to cart!`);
                
                setTimeout(() => {
                    hideMaterialsPage();
                }, 1000);
            } else {
                showErrorMessage('Please select a granite type and quantity.');
            }
        });
    }
    
    // Granite selection
    document.querySelectorAll('.granite-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            document.querySelectorAll('.granite-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            option.classList.add('selected');
            selectedGraniteType = option.getAttribute('data-granite');
        });
    });
    
    // Checkout handlers
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutCancel = document.getElementById('checkout-cancel');
    const checkoutPay = document.getElementById('checkout-pay');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showCheckoutModal();
        });
    }
    
    if (checkoutCancel) {
        checkoutCancel.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            hideModal('checkout-modal');
        });
    }
    
    if (checkoutPay) {
        checkoutPay.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            hideModal('checkout-modal');
            showSuccessMessage('Order placed successfully! Thank you for choosing D&A Constructions.');
            
            // Reset cart
            Object.keys(cart).forEach(key => {
                cart[key] = key === 'granite' ? '' : 0;
            });
            updateCartSummary();
        });
    }
    
    // Form submission
    const joinForm = document.getElementById('join-form');
    const thankYouMessage = document.getElementById('thank-you-message');
    
    if (joinForm) {
        joinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic validation
            const formData = new FormData(joinForm);
            const name = formData.get('name');
            const phone = formData.get('phone');
            const aadhaar = formData.get('aadhaar');
            const address = formData.get('address');
            
            if (!name || !phone || !aadhaar || !address) {
                showErrorMessage('Please fill in all required fields.');
                return;
            }
            
            // Phone validation
            if (!/^\d{10}$/.test(phone)) {
                showErrorMessage('Please enter a valid 10-digit phone number.');
                return;
            }
            
            // Aadhaar validation
            if (!/^\d{12}$/.test(aadhaar)) {
                showErrorMessage('Please enter a valid 12-digit Aadhaar number.');
                return;
            }
            
            // Success
            joinForm.classList.add('hidden');
            setTimeout(() => {
                if (thankYouMessage) {
                    thankYouMessage.classList.remove('hidden');
                    thankYouMessage.classList.add('show');
                }
            }, 300);
        });
    }
    
    // Escape key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideModal('quantity-modal');
            hideModal('granite-modal');
            hideModal('checkout-modal');
            const materialsPage = document.getElementById('materials-page');
            if (materialsPage && materialsPage.classList.contains('active')) {
                hideMaterialsPage();
            }
        }
    });
    
    // Add loading animation to hero
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(20px)';
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 500);
    }
});

// Scroll-based animations
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const actionButtons = document.querySelectorAll('.action-btn, .material-btn');
    
    actionButtons.forEach((btn, index) => {
        if (isElementInViewport(btn)) {
            if (currentScrollY > lastScrollY) {
                // Scrolling down - fade out
                btn.style.opacity = '0.3';
                btn.style.transform = 'translateY(20px) scale(0.95)';
            } else {
                // Scrolling up - fade in
                btn.style.opacity = '1';
                btn.style.transform = 'translateY(0) scale(1)';
            }
        }
    });
    
    lastScrollY = currentScrollY;
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add floating animation to offer images
function addFloatingAnimation() {
    const offerImages = document.querySelectorAll('.offer-image-card img');
    offerImages.forEach((img, index) => {
        img.style.animation = `float 3s ease-in-out infinite ${index * 0.5}s`;
    });
}

// CSS for floating animation (added dynamically)
const floatingCSS = `
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}
`;

const style = document.createElement('style');
style.textContent = floatingCSS;
document.head.appendChild(style);

// Initialize floating animation after page load
window.addEventListener('load', () => {
    addFloatingAnimation();
});