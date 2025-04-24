"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("user"));

  //DYANAMICALLY RENDER SLIDER BANNERS
  try {
    const sliderData = [
      {
        img: "/assets/media/BG/banner-1.jpg",
        topText: "Trending Items",
        title: "Women's latest fashion sale",
        price: "299",
      },
      {
        img: "/assets/media/BG/banner-2.jpg",
        topText: "Trending Accessories",
        title: "Modern Sunglasses",
        price: "199",
      },
      {
        img: "/assets/media/BG/banner-3.jpg",
        topText: "Offer Offer!!",
        title: "New fashion summer sale",
        price: "499",
      },
    ];

    const sliderContainer = document.querySelector(".main__slider");
    sliderData?.forEach((item) => {
      const slide = document.createElement("div");
      slide.className = "slider__item";
      slide.innerHTML = `
        <img class="slider__img" src="${item.img}" alt="" />
        <div class="slider__content">
            <p class="slider__content-top">${item.topText}</p>
            <h2 class="slider__content-title">${item.title}</h2>
            <p class="slider__content-text">
                starting at ₹ <b style="font-size: 1.8rem">${item.price}</b>.00
            </p>
            <a href="#product_box"><button class="slider__content-btn">SHOP NOW</button></a>
        </div>
      `;
      sliderContainer?.insertAdjacentElement("beforeend", slide);
    });
  } catch (error) {
    Swal.fire("Error", "Failed to load slider banners.", "error");
  }

  //RETURN NUMBER OF PRODUCTS IN CATEGORY
  const getProductCount = async (categoryId) => {
    try {
      const data = await fetch(
        `/api/products/getProductByCategoryId/${categoryId}`
      );
      const json = await data.json();
      return json.data;
    } catch (err) {
      Swal.fire("Error", "Failed to fetch product count.", "error");
      return 0;
    }
  };

  //RENDERING CATEGORIES CARD
  const categoryContainer = document.querySelector(".category__container");
  const renderCategoryItem = async (category) => {
    return `
      <div class="category__item">
        <div class="category__img-box">
          <img class="cat-img" src="/assets/media/categories/${
            category.image
          }" width="70" alt="${category.categoryName}" />
        </div>
        <div class="category__content-box">
          <div class="cat_content">
            <p class="cat_content-text">${category.categoryName}</p>
            <p class="cat_content-stock">(${await getProductCount(
              category.id
            )})</p>
          </div>
          <a href="/products/category/${
            category.id
          }" class="cat-btn">Show All</a>
        </div>
      </div>
    `;
  };

  if (categoryContainer) {
    fetch("/api/category/getAllCategories")
      .then((res) => res.json())
      .then(async (categories) => {
        const htmlItems = await Promise.all(
          categories.data.map((cat) => renderCategoryItem(cat))
        );
        categoryContainer.innerHTML = htmlItems.join("");
      })
      .catch((err) => {
        Swal.fire("Error", "Failed to load categories.", "error");
        console.error("Failed to load categories", err);
      });
  }

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

  const productContainer = document.querySelector(".product__menu");
  const searchInput = document.querySelector(".product_search-field");
  let allProducts = [];

  // Fetch all products
  async function fetchAllProducts() {
    try {
      const res = await fetch("/api/products/getAllProducts");
      const data = await res.json();
      allProducts = data.data || [];
      renderProducts(allProducts);
    } catch (err) {
      console.error("Failed to fetch products", err);
      Swal.fire("Error", "Failed to load products.", "error");
    }
  }

  // Render products
  function renderProducts(products) {
    if (!products.length) {
      productContainer.innerHTML =
        "<p style='font-size:1.5rem; display:flex; justify-content:center; align-items:center; margin-top:20px;'>Not found!!</p>";
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
            product.discount
              ? `<p class="product_img-lable">${product.discount}%</p>`
              : ""
          }
        </div>
        <div class="product__content-box">
          <a href="#">
            <h2 class="product-category">${
              product.category?.categoryName || "Category"
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
          <button class="product__add_btn" data-id=${
            product.id
          }>ADD TO CART</button>
        </div>
      </div>
    `;
      })
      .join("");
  }

  productContainer?.addEventListener("click", async (e) => {
    e.preventDefault();
    const target = e.target;
    if (target.classList.contains("product__add_btn")) {
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
          timer: 2000,
          showConfirmButton: false,
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

  // HANDELES SEARCH
  searchInput?.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    const filtered = allProducts.filter((product) =>
      product.title.toLowerCase().includes(query)
    );
    renderProducts(filtered);
  });

  fetchAllProducts();
});
