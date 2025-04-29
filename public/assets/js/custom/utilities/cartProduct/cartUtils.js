// CART PRODUCTS COUNT
const user = JSON.parse(localStorage.getItem("user"));
export async function updateCartCount() {
  try {
    const response = await fetch(
      `/api/cartProducts/getCartByUserId/${user.id}`
    );
    const cartData = await response.json();

    const cartCountElement = document.querySelector(".cartProductsCount");
    if (cartCountElement) {
      cartCountElement.textContent = cartData.data.length;
    }
  } catch (error) {
    console.error("Failed to update cart count:", error);
  }
}

export async function fetchCartItems() {
  try {
    const res = await fetch(`/api/cartProducts/getCartByUserId/${user.id}`);
    const data = await res.json();
    if (data.success) {
      return data.data;
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

export async function getCategory(categoryId) {
  try {
    const response = await fetch(`/api/category/getCategory/${categoryId}`);
    const categoryData = await response.json();
    return categoryData.data;
  } catch (error) {
    console.error("Failed to get Data");
  }
}
