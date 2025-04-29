"use strict";
import {
  updateCartCount,
  fetchCartItems,
} from "../../../utilities/cartProduct/cartUtils.js";

document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("user"));
  const categoryId = parseInt(
    document.querySelector(".categoryId").dataset.categoryid
  );

  //GET ALL CATEGORIES DATA
  const getCategoryData = async () => {
    const response = await fetch("/api/category/getAllCategories", {
      method: "GET",
    });
    const data = await response.json();
    return data.data;
  };

  //GENERATE STARS CONTROLLER
  function generateRatingStars(rating) {
    let starsHTML = "";
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.2;
    const totalStars = 5;

    for (let i = 0; i < fullStars; i++) {
      starsHTML += `<ion-icon name="star"></ion-icon>`;
    }
    if (hasHalfStar) {
      starsHTML += `<ion-icon name="star-half-outline"></ion-icon>`;
    }
    const remainingStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < remainingStars; i++) {
      starsHTML += `<ion-icon name="star-outline"></ion-icon>`;
    }
    return starsHTML;
  }

  const catProductContainer = document.querySelector(".category_Products");
  const otherContainer = document.querySelector(".other_products");
  const title = document.querySelector(".category_name");
  const containers = [catProductContainer, otherContainer];
  let allProducts = [];
  let categoryProducts = [];

  async function fetchAllProducts() {
    try {
      // SETTING UP TITLE
      const categories = await getCategoryData();
      title.textContent = `${
        categories.find((cat) => cat.id == categoryId).categoryName
      } Items`;

      const res = await fetch("/api/products/getAllProducts");
      const data = await res.json();
      allProducts = data.data || [];
      categoryProducts = data.data.filter(
        (product) => product.categoryID == categoryId
      );
      await renderProducts(categoryProducts, catProductContainer);
      await renderProducts(allProducts, otherContainer);
    } catch (err) {
      console.error("Failed to fetch products", err);
      Swal.fire("Error", "Failed to load products.", "error");
    }
  }

  // Render products
  async function renderProducts(products, containerEle) {
    if (!products.length) {
      containerEle.innerHTML =
        "<p style='font-size:1.5rem; display:flex; justify-content:center; align-items:center; margin-top:20px;'>Not found!!</p>";
      return;
    }
    const categoryData = await getCategoryData();
    const cartData = await fetchCartItems();
    containerEle.innerHTML = products
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
          <a href="#">
            <h2 class="product-category">${
              categoryData.find((cat) => cat.id == product.categoryID)
                ?.categoryName
            }</h2>
          </a>
          <a href="#">
            <h2 class="product-title text-truncate d-inline-block" style="max-width:150px">${
              product.title
            }</h2>
          </a>
          <div class="showcase__rating">${generateRatingStars(
            product.rating
          )}</div>
          <p class="product-price">₹${product.price}.00</p>
          ${
            cartData.find((p) => p.productId == product.id)
              ? `<a href="/primestore/cart/${user.id}"><button class="goto_cartBtn" data-id=${product.id}>GO TO CART</button></a>`
              : `
            <button class="product__add_btn" data-id=${product.id}>ADD TO CART</button>`
          }
        </div>
      </div>
    `;
      })
      .join("");
  }

  containers.forEach((ele) => {
    ele.addEventListener("click", async (e) => {
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
              userId: user.id,
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
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "btn btn-primary",
              popup: "swal2-popup-custom",
            },
            buttonsStyling: false,
          });
          updateCartCount();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.message || "Something went wrong!",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "btn btn-danger",
              popup: "swal2-popup-custom",
            },
            buttonsStyling: false,
          });
        }
      }
    });
  });
  fetchAllProducts();
});
