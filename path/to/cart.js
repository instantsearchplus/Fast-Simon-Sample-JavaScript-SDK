// SDK Fast Simon cart events usage

// Report when cart page is visited
function reportCartVisited() {
    window.FastSimonSDK.event({
        reportAppType: "SPA",
        eventName: window.FastSimonEventName.CartVisited,
        data: {}
    });
    console.log('Cart visited event reported');
}

// Report when a product is added to cart
function reportAddToCart(productID) {
    if (!productID) {
        console.error('Product ID is required for AddToCartPerformed event');
        return;
    }

    window.FastSimonSDK.event({
        reportAppType: "SPA",
        eventName: window.FastSimonEventName.AddToCartPerformed,
        data: {
            productID: productID.toString() // (Required) The ID of the product added to cart
        }
    });
    console.log('Add to cart event reported for product:', productID);
}

// Example: Add to cart button click handler
// This can be called when an "Add to Cart" button is clicked on a product
function handleAddToCartClick(productElement) {
    const productID = productElement.getAttribute('data-product-id');
    if (productID) {
        reportAddToCart(productID);
        // Add your actual cart logic here (e.g., update cart state, show notification, etc.)
    }
}

// Example: Call this when navigating to or opening a cart page/modal
function onCartPageLoad() {
    reportCartVisited();
}
