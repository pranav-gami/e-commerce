"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const cartBody = document.getElementById("cart-body");
  const totalElement = document.getElementById("total");
  const userId = parseInt(document.querySelector(".getId").dataset.userId);

  async function fetchCartItems() {
    try {
      const res = await fetch(`/api/cartProducts/getCartByUserId/${userId}`);
      const data = await res.json();
      if (data.success) {
        renderCartItems(data.data);
      } else {
        Swal.fire("Error", "Failed to fetch cart items.", "error");
        console.error("Failed to fetch cart items.");
      }
    } catch (error) {
      Swal.fire(
        "Error",
        "Something went wrong while fetching cart items.",
        "error"
      );
      console.error("Error fetching cart items:", error);
    }
  }

  async function updateCartQuantity(productId, quantity) {
    try {
      const res = await fetch(`/api/cartProducts/updateCartProduct/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await res.json();
      if (!data.success) {
        Swal.fire("Error", "Failed to update product quantity.", "error");
        console.error("Failed to update quantity");
      }
    } catch (error) {
      Swal.fire(
        "Error",
        "Something went wrong while updating quantity.",
        "error"
      );
      console.error("Error updating cart:", error);
    }
  }

  async function deleteCartProduct(productId) {
    try {
      const res = await fetch(`/api/cartProducts/deleteCartProduct/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();
      if (!data.success) {
        Swal.fire("Error", "Failed to delete product from cart.", "error");
        console.error("Failed to delete cart product");
      }
    } catch (error) {
      Swal.fire(
        "Error",
        "Something went wrong while deleting product.",
        "error"
      );
      console.error("Error deleting cart product:", error);
    }
  }

  function renderCartItems(cartItems) {
    cartBody.innerHTML = "";
    let grandTotal = 0;
    if (cartItems.length != 0) {
      cartItems.forEach((item, index) => {
        const subtotal = item.product.price * item.quantity;
        grandTotal += subtotal;

        const row = document.createElement("tr");
        row.innerHTML = `
      <td class="text-start" style="padding-left: 30px;">
        <img src="/assets/media/products/${
          item.product.image
        }" width="70" height="70" style="border-radius: 5px;" alt="Product" />
      </td>
      <td class="text-start"><span class="cartproduct__title text-truncate d-inline-block" style="max-width:200px">${
        item.product.title
      }</span></td>
      <td class="text-center cartproduct__price"><span class="cartproduct__price">₹ ${item.product.price.toFixed(
        2
      )}</span></td>
      <td class="text-center">
        <div class="input-group quantity-group" style="max-width: 130px; margin: auto;">
          <button class="btn btn-outline-secondary btn-sm decrease" data-index="${index}" data-productid=${
          item.productId
        }>−</button>
          <input type="text" class="form-control text-center quantity-input" value="${
            item.quantity
          }" readonly />
          <button class="btn btn-outline-secondary btn-sm increase" data-index="${index}" data-productid=${
          item.productId
        }>+</button>
        </div>
      </td>
      <td class="text-center item-subtotal"><span class="cartproduct__subtotal">₹ ${subtotal.toFixed(
        2
      )}</span></td>
      <td class="text-center">
        <button class="remove-btn btn btn-sm btn-outline-dark" data-index="${index}">Remove</button>
      </td>
    `;
        cartBody.appendChild(row);
      });
      totalElement.textContent = `₹ ${grandTotal.toFixed(2)}`;
      attachEventListeners(cartItems);
    } else {
      cartBody.innerHTML =
        "<p style='font-size:1.5rem ;display:flex; width=100%; justify-content: center;align-items:center; margin-top:20px;grid-column: span 5'>Not found!!</p>";
    }
  }

  function attachEventListeners(cartItems) {
    document.querySelectorAll(".increase").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const index = btn.getAttribute("data-index");
        const productId = btn.getAttribute("data-productid");
        cartItems[index].quantity++;
        await updateCartQuantity(productId, cartItems[index].quantity);
        renderCartItems(cartItems);
      });
    });

    document.querySelectorAll(".decrease").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const index = btn.getAttribute("data-index");
        const productId = btn.getAttribute("data-productid");
        if (cartItems[index].quantity > 1) {
          cartItems[index].quantity--;
          await updateCartQuantity(
            productId,
            parseInt(cartItems[index].quantity)
          );
          renderCartItems(cartItems);
        }
      });
    });

    document.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const index = btn.getAttribute("data-index");
        const productId = cartItems[index].productId;
        await deleteCartProduct(productId);
        cartItems.splice(index, 1);
        renderCartItems(cartItems);
      });
    });
  }

  fetchCartItems();

  function generateRatingStars(rating) {
    let starsHTML = "";
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.2;
    const totalStars = 5;

    for (let i = 0; i < fullStars; i++) {
      starsHTML += `<ion-icon name="star" role="img" aria-label="star"></ion-icon>`;
    }
    if (hasHalfStar) {
      starsHTML += `<ion-icon name="star-half-outline"></ion-icon>`;
    }
    const remainingStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < remainingStars; i++) {
      starsHTML += `<ion-icon name="star-outline" role="img" aria-label="star outline"></ion-icon>`;
    }
    return starsHTML;
  }

  const productContainer = document.querySelector(".product__menu");
  const searchInput = document.querySelector(".product_search-field");

  let toprated = [];
  let allProducts = [];

  async function fetchAllProducts() {
    try {
      const res = await fetch("/api/products/getAllProducts");
      const data = await res.json();
      allProducts = data.data;
      toprated = data.data.filter((product) => product.rating >= 4);
      renderProducts(toprated);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch product list.", "error");
      console.error("Failed to fetch products", err);
    }
  }

  function renderProducts(products) {
    if (!products.length) {
      productContainer.innerHTML =
        "<p style='font-size:1.5rem ;display:flex; width=100%; justify-content: center;align-items:center; margin-top:20px;grid-column: span 5'>Not found!!</p>";
      return;
    }
    productContainer.innerHTML = products
      .map((product) => {
        return `
          <div class="product__item">
            <div class="product__img-box">
              <img class="product_img" style="border-radius:5px;" src="/assets/media/products/${
                product.image
              }" alt="${product.title}" width="300" />
              ${
                product.rating == 5
                  ? `<p class="product_img-lable">Top Rated</p>`
                  : ""
              }
            </div>
            <div class="product__content-box">
              <a href="#"><h2 class="product-category">${
                product.category?.categoryName || "Category"
              }</h2></a>
              <a href="#"><h2 class="product-title text-truncate d-inline-block" style="max-width:150px">${
                product.title
              }</h2></a>
              <div class="showcase__rating">${generateRatingStars(
                product.rating
              )}</div>
              <p class="product-price">₹${product.price}.00</p>
              <a href=""><button class="product__add_btn" data-id="${
                product.id
              }">ADD TO CART</button></a>
            </div>
          </div>
        `;
      })
      .join("");
  }

  productContainer?.addEventListener("click", async (e) => {
    const target = e.target;
    e.preventDefault();
    if (target.classList.contains("product__add_btn")) {
      const productId = target.dataset.id;
      console.log(userId, productId);
      try {
        const response = await fetch("/api/cartProducts/addProduct", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            productId: parseInt(productId),
            quantity: 1,
          }),
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Failed to add product.");
        }
        Swal.fire({
          icon: "success",
          title: "Added to Cart",
          text: "Product has been added to your cart!",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          location.reload();
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message || "Something went wrong!",
        });
      }
    }
  });

  searchInput?.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    let filtered;
    if (query == "") {
      filtered = toprated.filter((product) =>
        product.title.toLowerCase().includes(query)
      );
    } else {
      filtered = allProducts.filter((product) =>
        product.title.toLowerCase().includes(query)
      );
    }
    renderProducts(filtered);
  });

  fetchAllProducts();
});
