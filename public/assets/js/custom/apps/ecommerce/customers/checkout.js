import { fetchCartItems } from "../../../utilities/cartProduct/cartUtils.js";
const stripe = Stripe(
  "<%= pk_test_51RKYzCQG00iI7cRU9lHP65WhDkcZTCgX6wEMvMtKO4NTd7s8uGUkLM7c2wMCrM6IMwLa4snURoX6H7r1KENREY2P00AOd0DCAp %>"
);

document.addEventListener("DOMContentLoaded", async () => {
  // GETTING USER'S DATA
  const user = JSON.parse(localStorage.getItem("user"));

  const cartBody = document.getElementById("cart_body");
  const summaryQtyEle = document.querySelector(".qty");
  const summaryTotalEle = document.querySelector(".summary_total");
  const discountEle = document.querySelector(".summary_discount");
  const platformFeeEle = document.querySelector(".summary_pt-fee");
  const finalTotalEle = document.querySelector(".final_total");

  const buyerNameEle = document.querySelector(".buyername");
  const addressEle = document.querySelector(".address");
  const phoneEle = document.querySelector(".phone");
  const editButton = document.querySelector(".edit_button");
  const editForm = document.querySelector(".edit-form");
  const addressInput = document.querySelector(".address-input");
  const cancelButton = document.querySelector(".cancel_button");

  const discount = 100;
  const platformFee = 20;
  let finalTotal;
  async function renderCartItems(cartItems) {
    cartBody.innerHTML = "";
    let grandTotal = 0;

    if (cartItems.length === 0) {
      cartBody.innerHTML = `<tr><td colspan="3" class="text-center">Your cart is empty.</td></tr>`;
      summaryQtyEle.textContent = `PRICE DETAILS(0 item)`;
      summaryTotalEle.textContent = `₹0.00`;
      discountEle.textContent = `- ₹0.00`;
      finalTotalEle.textContent = `₹0.00`;
      return;
    }

    cartItems.forEach((item) => {
      const subtotal = item.product.price * item.quantity;
      grandTotal += subtotal;

      const row = document.createElement("tr");
      row.innerHTML = `
          <td class="text-start">${item.product.title}</td>
          <td class="text-center">${item.quantity}</td>
          <td class="text-end">₹${subtotal.toFixed(2)}</td>
        `;
      cartBody.appendChild(row);
    });

    summaryQtyEle.textContent = `PRICE DETAILS(${cartItems.length} item${
      cartItems.length > 1 ? "s" : ""
    })`;
    summaryTotalEle.textContent = `₹${grandTotal.toFixed(2)}`;
    discountEle.textContent = `- ₹${discount.toFixed(2)}`;
    platformFeeEle.textContent = `₹${platformFee.toFixed(2)}`;
    finalTotal = grandTotal - discount + platformFee;
    finalTotalEle.textContent = `₹${finalTotal.toFixed(2)}`;
  }

  fetchCartItems().then((data) => {
    renderCartItems(data);
  });

  // Fetch and render user address
  async function fetchUserAddress() {
    try {
      const res = await fetch(`/api/user/getUser/${user.id}`);
      const data = await res.json();
      if (data.success) {
        return data.data;
      } else {
        Swal.fire("Error", "Failed to fetch address.", "error");
        return null;
      }
    } catch (error) {
      Swal.fire(
        "Error",
        "Something went wrong while fetching address.",
        "error"
      );
      console.error("Error fetching address:", error);
      return null;
    }
  }

  function renderAddress(userdata) {
    buyerNameEle.innerHTML = `${userdata.username} <span class="home-badge">HOME</span>`;
    addressEle.textContent = userdata.address;
    phoneEle.innerHTML = `Mobile: <strong>${user.phone}</strong>`;

    // Fill edit form with current values
    addressInput.value = userdata.address;
  }

  async function updateUserAddress(newAddress) {
    try {
      const res = await fetch(`/api/user/updateAddress/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: newAddress }),
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire("Success", "Address updated successfully.", "success");
        return true;
      } else {
        Swal.fire("Error", "Failed to update address.", "error");
        return false;
      }
    } catch (error) {
      Swal.fire(
        "Error",
        "Something went wrong while updating address.",
        "error"
      );
      console.error("Error updating address:", error);
      return false;
    }
  }

  // Event Listeners for address form
  editButton.addEventListener("click", () => {
    editForm.style.display = "block";
    editButton.style.display = "none";
  });

  cancelButton.addEventListener("click", () => {
    editForm.style.display = "none";
    editButton.style.display = "inline-block";
  });

  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newAddress = addressInput.value.trim();
    if (!newAddress) {
      Swal.fire("Warning", "Address is required.", "warning");
      return;
    }

    const success = await updateUserAddress(newAddress);
    if (success) {
      renderAddress({
        username: user.username,
        address: newAddress,
      });
      editForm.style.display = "none";
      editButton.style.display = "inline-block";
    }
  });

  const stripe = Stripe(
    "pk_test_51RKYzCQG00iI7cRU9lHP65WhDkcZTCgX6wEMvMtKO4NTd7s8uGUkLM7c2wMCrM6IMwLa4snURoX6H7r1KENREY2P00AOd0DCAp"
  );
  const continueBtn = document.querySelector(".continue-btn");
  const payButtons = document.querySelectorAll(".pay-btn");
  const paymentModalEl = document.getElementById("paymentMethodModal");
  const paymentModal = new bootstrap.Modal(paymentModalEl);

  continueBtn.addEventListener("click", () => {
    paymentModal.show();
  });

  async function placeOrder(
    totalAmount,
    paymentMethod,
    paymentIntentId = null
  ) {
    try {
      const res = await fetch("/api/order/placeOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          paymentType: paymentMethod,
          totalAmount,
          paymentIntentId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        await Swal.fire("Success", "Your order has been placed!", "success");
        window.location.href = "/primestore";
      } else {
        Swal.fire("Error", "Failed to place order. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      Swal.fire("Error", "Something went wrong. Please try again.", "error");
    }
  }

  // Initiate Stripe Checkout Session
  async function initiateStripePayment(amount) {
    try {
      const res = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();

      if (res.ok && data.sessionId) {
        return { success: true, sessionId: data.sessionId };
      } else {
        console.error("API error:", data.error);
        return {
          success: false,
          error: data.error || "Failed to create session",
        };
      }
    } catch (error) {
      console.error("Error calling API:", error);
      return { success: false, error: error.message };
    }
  }

  payButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const method = btn.dataset.method; // COD / UPI / CARD
      paymentModal.hide();

      if (method === "COD") {
        const confirmResult = await Swal.fire({
          title: "Confirm COD Order?",
          text: "Are you sure you want to place the order with Cash On Delivery?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes, Confirm",
        });
        if (confirmResult.isConfirmed) {
          await placeOrder(finalTotal, "COD");
        }
      }

      if (method === "UPI" || method === "CARD") {
        const paymentResult = await initiateStripePayment(finalTotal);

        if (paymentResult.success) {
          const { sessionId } = paymentResult;
          const { error } = await stripe.redirectToCheckout({ sessionId });

          if (error) {
            console.error("Stripe redirect error:", error.message);
            Swal.fire("Error", error.message, "error");
          } else {
            console.log("called");
            await placeOrder(finalTotal, method);
          }
        } else {
          Swal.fire("Error", paymentResult.error, "error");
        }
      }
    });
  });

  const userdata = await fetchUserAddress();
  if (userdata) {
    renderAddress(userdata);
  }
});
