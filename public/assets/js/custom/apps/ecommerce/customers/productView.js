document.addEventListener("DOMContentLoaded", async () => {
  const productView = document.querySelector(".product__view");
  const productId = productView?.getAttribute("data-productid");

  if (!productId) {
    console.error("Product ID not found.");
    return;
  }

  try {
    // Fetch product details from your API
    const response = await fetch(`/api/products/getProduct/${productId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product details");
    }

    const product = await response.json();
    if (!product.success) {
      throw new Error("Product not found");
    }
    const data = product.data;

    const productImage = document.querySelector(".product-img-box img");
    const productTitle = document.querySelector(".product_title");
    const productDescription = document.querySelector(".product_description");
    const ratingBadge = document.querySelector(".badge.rating");
    const ratingText = document.querySelector("small.rating");
    const finalPrice = document.querySelector(".final_price");
    const oldPrice = document.querySelector(".product_price");
    const discountPercent = document.querySelector(".discount_percent");

    if (productImage) productImage.src = `/assets/media/products/${data.image}`;
    if (productTitle) productTitle.textContent = data.title || "No Title";
    if (productDescription)
      productDescription.textContent = data.description || "No Description";
    if (ratingBadge) ratingBadge.textContent = `${data.rating} ★`;
    if (ratingText) ratingText.textContent = `${data.rating} Ratings`;
    if (finalPrice) finalPrice.textContent = `₹${data.price}`;
    if (oldPrice) oldPrice.textContent = `₹${126999}`;
    if (discountPercent) discountPercent.textContent = `(${10}% OFF)`;
  } catch (error) {
    console.error("Error loading product:", error.message);
  }
});
