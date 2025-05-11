import {
  fetchCartItems,
  getCategory,
} from "../../../utilities/cartProduct/cartUtils.js";

document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("user"));
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get("q")?.toLowerCase() || "";

  const searchedContainer = document.querySelector(".product__menu.searched");
  const suggestedContainer = document.querySelector(".product__menu.Suggested");

  // Fetch all products
  async function fetchAllProducts() {
    try {
      const response = await fetch("/api/products/getAllProducts");
      const products = await response.json();
      filterAndDisplayProducts(products.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  // Fetch category data
  async function getCategoryData() {
    try {
      const response = await fetch(`/api/category/getAllCategories`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching category data:", error);
      return [];
    }
  }

  // Generate rating stars HTML
  function generateRatingStars(rating) {
    const filledStars = Math.floor(rating);
    const emptyStars = 5 - filledStars;
    return "★".repeat(filledStars) + "☆".repeat(emptyStars);
  }

  // Filter and render products
  async function filterAndDisplayProducts(products) {
    const searchedProducts = [];
    const suggestedProducts = [];

    products.forEach(async (product) => {
      const name = product.title?.toLowerCase() || "";
      const description = product.description?.toLowerCase() || "";
      const categoryData = await getCategory(product.categoryID);
      if (name.includes(searchQuery) || description.includes(searchQuery)) {
        searchedProducts.push(product);
        categoryData.Subcategory.forEach((sub) => {
          if (sub.name.toLowerCase().includes(searchQuery)) {
            suggestedProducts.push(product);
          }
        });
      } else if (
        categoryData.categoryName.toLowerCase().includes(searchQuery)
      ) {
        searchedProducts.push(product);
      }
    });

    await renderProducts(
      searchedProducts,
      searchedContainer,
      `No result for ${searchQuery}`
    );
    await renderProducts(
      suggestedProducts,
      suggestedContainer,
      "No suggested products found."
    );
  }

  // Render products inside a container
  async function renderProducts(products, container, emptyMessage) {
    const cartData = await fetchCartItems();
    const categoryData = await getCategoryData();

    container.innerHTML = "";

    if (!products.length) {
      container.innerHTML = `<p style='font-size:1.5rem; display:flex; justify-content:center; align-items:center; margin-top:20px;'>${emptyMessage}</p>`;
      return;
    }

    container.innerHTML = products
      .map((product) => {
        return `
        <div class="product__item">
          <a href="/primestore/product/${product.id}">
            <div class="product__img-box">
              <img class="product_img" style="border-radius:5px;" src="/assets/media/products/${
                product.image
              }" alt="${product.title}" width="300" />
              ${
                product.discount
                  ? `<p class="product_img-lable">${product.discount}% OFF</p>`
                  : ""
              }
            </div>
          </a>
          <div class="product__content-box">
            <a href="#">
              <h2 class="product-category">${
                categoryData.find((cat) => cat.id == product.categoryID)
                  ?.categoryName || "Unknown Category"
              }</h2>
            </a>
            <a href="#">
              <h2 class="product-title text-truncate d-inline-block" style="max-width:150px;">${
                product.title
              }</h2>
            </a>
            <div class="showcase__rating">${generateRatingStars(
              product.rating
            )}</div>
            <p class="product-price">₹${product.price}.00</p>
            ${
              cartData.find((p) => p.productId == product.id)
                ? `<a href="/primestore/cart/${
                    user.id || ""
                  }"><button class="goto_cartBtn" data-id=${
                    product.id
                  }>GO TO CART</button></a>`
                : `<button class="product__add_btn" data-id=${product.id}>ADD TO CART</button>`
            }
          </div>
        </div>
        `;
      })
      .join("");
  }

  searchedContainer?.addEventListener("click", async (e) => {
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
          timer: 2000,
          showConfirmButton: false,
          customClass: "swal2-popup-custom",
        }).then(() => {
          updateCartCount();
          location.reload();
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message || "Something went wrong!",
          customClass: "swal2-popup-custom",
        });
      }
    }
  });

  if (searchQuery) {
    fetchAllProducts();
  } else {
    searchedContainer.innerHTML = "<p>Please enter a search query.</p>";
    suggestedContainer.innerHTML = "";
  }
});
