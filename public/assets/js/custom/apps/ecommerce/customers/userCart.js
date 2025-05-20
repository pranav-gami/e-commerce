"use strict";
import {
  updateCartCount,
  fetchCartItems,
} from "../../../utilities/cartProduct/cartUtils.js";

document.addEventListener("DOMContentLoaded", function () {
  const cartBody = document.getElementById("cart-body");
  const cartContainer = document.querySelector(".cartContainer");
  const emptyCart = document.getElementById("empty-cart");
  const totalElement = document.getElementById("total");

  // CART SUMMARY ELEMENTS
  const summaryTotalEle = document.querySelector(".summary_total");
  const discountEle = document.querySelector(".summary_discount");
  const finalTotalEle = document.querySelector(".final_total");

  const userId = parseInt(document.querySelector(".getId").dataset.userId);

  let cartItemsGlobal = [];

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
        Swal.fire({
          title: "Error",
          text: "Failed to update product quantity.",
          icon: "error",
          customClass: "swal2-popup-custom",
        });
        console.error("Failed to update quantity");
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Something Wrong while updateing Qiantity.",
        icon: "error",
        customClass: "swal2-popup-custom",
      });
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
        Swal.fire({
          title: "Error",
          text: "Failed to Remove product from Cart!",
          icon: "error",
          customClass: "swal2-popup-custom",
        });
        console.error("Failed to delete cart product");
      } else {
        updateCartCount();
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Something Wrong while deleing Product.",
        icon: "error",
        customClass: "swal2-popup-custom",
      });
      console.error("Error deleting cart product:", error);
    }
  }

  function renderCartItems(cartItems) {
    cartBody.innerHTML = "";
    let grandTotal = 0;
    const discount = 100;
    const platformFees = 20;

    if (cartItems.length !== 0) {
      cartContainer.classList.remove("d-none");
      emptyCart.classList.add("d-none");

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
          <td class="text-start"><span class="cartproduct__title text-truncate d-inline-block" style="max-width:150px">${
            item.product.title
          }</span></td>
          <td class="text-center cartproduct__price"><span class="cartproduct__price">₹ ${item.product.price.toFixed(
            2
          )}</span></td>
          <td class="text-center">
            <div class="input-group quantity-group" style="min-width: 130px; margin: auto;">
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
      summaryTotalEle.textContent = `₹ ${grandTotal.toFixed(2)}`;
      discountEle.textContent = `- ₹${discount.toFixed(2)}`;
      const finaltotal = grandTotal - discount + platformFees;
      finalTotalEle.textContent = `₹ ${finaltotal.toFixed(2)}`;

      attachEventListeners(cartItems);
    } else {
      cartContainer.classList.add("d-none");
      emptyCart.classList.remove("d-none");
    }
  }

  function attachEventListeners(cartItems) {
    document.querySelectorAll(".increase").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const index = btn.getAttribute("data-index");
        const productId = btn.getAttribute("data-productid");
        cartItems[index].quantity++;
        await updateCartQuantity(productId, cartItems[index].quantity);
        await syncCartAndProducts();
      });
    });

    document.querySelectorAll(".decrease").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const index = btn.getAttribute("data-index");
        const productId = btn.getAttribute("data-productid");
        if (cartItems[index].quantity > 1) {
          cartItems[index].quantity--;
          await updateCartQuantity(productId, cartItems[index].quantity);
          await syncCartAndProducts();
        } else {
          // Confirm before removing if quantity goes to 0
          const result = await Swal.fire({
            title: "Remove Item?",
            text: "Do you want to remove this item from the cart?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, remove it",
            cancelButtonText: "Cancel",
            customClass: "swal2-popup-custom",
          });

          if (result.isConfirmed) {
            await deleteCartProduct(parseInt(productId));
            cartItems.splice(index, 1);
            await syncCartAndProducts();
          }
        }
      });
    });

    document.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const index = btn.getAttribute("data-index");
        const productId = cartItems[index].productId;

        const result = await Swal.fire({
          title: "Remove Item?",
          text: "Do you want to remove this item from the cart?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, remove it",
          cancelButtonText: "Cancel",
          customClass: "swal2-popup-custom",
        });

        if (result.isConfirmed) {
          await deleteCartProduct(productId);
          cartItems.splice(index, 1);
          await syncCartAndProducts();
        }
      });
    });
  }

  async function syncCartAndProducts() {
    cartItemsGlobal = await fetchCartItems();
    renderCartItems(cartItemsGlobal);
    await fetchAllProducts(); // sync suggested product buttons
    updateCartCount();
  }

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
      await renderProducts(toprated);
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Failed to fetch Products.",
        icon: "error",
        customClass: "swal2-popup-custom",
      });
      console.error("Failed to fetch products", err);
    }
  }

  async function renderProducts(products) {
    const cartData = cartItemsGlobal;
    if (!products.length) {
      productContainer.innerHTML =
        "<p style='font-size:1.5rem; display:flex; width=100%; justify-content:center; align-items:center; margin-top:20px; grid-column: span 5'>Not found!!</p>";
      return;
    }
    productContainer.innerHTML = products
      .map((product) => {
        return `
        <div class="product__item">
          <a href="/primestore/product/${product.id}">
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
          </a>
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
            ${
              cartData.find((p) => p.productId == product.id)
                ? `<a href="/primestore/cart/${userId}"><button class="goto_cartBtn" data-id=${product.id}>GO TO CART</button></a>`
                : `<button class="product__add_btn" data-id=${product.id}>ADD TO CART</button>`
            }
          </div>
        </div>
      `;
      })
      .join("");
  }

  productContainer?.addEventListener("click", async (e) => {
    const target = e.target;
    if (target.classList.contains("product__add_btn")) {
      e.preventDefault();
      const productId = target.dataset.id;
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
          timer: 1000,
          showConfirmButton: false,
          customClass: "swal2-popup-custom",
        }).then(async () => {
          await syncCartAndProducts();
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

  const placeOrderBtn = document.querySelector(".place-order-btn");

  placeOrderBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Confirm Order?",
      text: "Are you sure you want to place this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, place order",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "swal2-popup-custom",
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-active-light",
      },
      buttonsStyling: false,
    });
    if (result.isConfirmed) {
      window.location.href = "/primestore/checkout";
    }
  });

  searchInput?.addEventListener("input", async () => {
    const query = searchInput.value.trim().toLowerCase();
    let filtered;
    if (query === "") {
      filtered = toprated;
    } else {
      filtered = allProducts.filter((product) =>
        product.title.toLowerCase().includes(query)
      );
    }
    await renderProducts(filtered);
  });

  // INITIAL LOAD
  fetchCartItems().then((data) => {
    cartItemsGlobal = data;
    renderCartItems(cartItemsGlobal);
  });
  fetchAllProducts();
});
