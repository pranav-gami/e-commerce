import { fetchCartItems } from "../../../utilities/cartProduct/cartUtils.js";

const stripe = Stripe(
  "pk_test_51RKYzCQG00iI7cRU9lHP65WhDkcZTCgX6wEMvMtKO4NTd7s8uGUkLM7c2wMCrM6IMwLa4snURoX6H7r1KENREY2P00AOd0DCAp"
);

document.addEventListener("DOMContentLoaded", async () => {
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
  const addressInputs = document.querySelectorAll(".address-input");
  const cancelButton = document.querySelector(".cancel_btn");

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

  async function fetchUserAddress() {
    try {
      const res = await fetch(`/api/user/getUser/${user.id}`);
      const data = await res.json();
      if (data.success) {
        return data.data;
      } else {
        await Swal.fire({
          title: "Error",
          text: "Failed to fetch address.",
          icon: "error",
          customClass: "swal2-popup-custom",
        });
        return null;
      }
    } catch (error) {
      await Swal.fire({
        title: "Error",
        text: "Something went wrong while fetching address.",
        icon: "error",
        customClass: "swal2-popup-custom",
      });
      console.error("Error fetching address:", error);
      return null;
    }
  }

  function renderAddress(userdata) {
    buyerNameEle.innerHTML = `${userdata.username} <span class="home-badge">HOME</span>`;
    addressEle.textContent = userdata.address;
    phoneEle.innerHTML = `Mobile: <strong>${user.phone}</strong>`;

    const address = userdata.address.split(",");
    addressInputs[0].value = address[0]?.trim();
    addressInputs[1].value = address[1]?.trim();
    addressInputs[2].value = address[2]?.trim();
    addressInputs[3].value = address[3]?.replace("PIN:", "").trim();
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
        await Swal.fire({
          title: "Success",
          text: "Address updated successfully.",
          icon: "success",
          customClass: "swal2-popup-custom",
        });
        return true;
      } else {
        await Swal.fire({
          title: "Error",
          text: "Failed to update address.",
          icon: "error",
          customClass: "swal2-popup-custom",
        });
        return false;
      }
    } catch (error) {
      await Swal.fire({
        title: "Error",
        text: "Something went wrong while updating address.",
        icon: "error",
        customClass: "swal2-popup-custom",
      });
      console.error("Error updating address:", error);
      return false;
    }
  }

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

    const addressFields = editForm.querySelectorAll(".address-input");
    const localityInput = addressFields[0].value.trim();
    const cityInput = addressFields[1].value.trim();
    const districtInput = addressFields[2].value.trim();
    const pincodeInput = addressFields[3].value.trim();

    if (!localityInput || !cityInput || !districtInput || !pincodeInput) {
      await Swal.fire({
        title: "Warning",
        text: "All address fields are required.",
        icon: "warning",
        customClass: "swal2-popup-custom",
      });
      return;
    }

    if (!/^\d{6}$/.test(pincodeInput)) {
      await Swal.fire({
        title: "Warning",
        text: "Pincode must be exactly 6 digits.",
        icon: "warning",
        customClass: "swal2-popup-custom",
      });
      return;
    }

    const mergedAddress = `${localityInput}, ${cityInput}, ${districtInput} , PIN:${pincodeInput}`;
    const success = await updateUserAddress(mergedAddress);

    if (success) {
      renderAddress({
        username: user.username,
        address: mergedAddress,
      });
      editForm.style.display = "none";
      editButton.style.display = "inline-block";
    }
  });

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
        const clearRes = await fetch(
          `/api/cartProducts/clearUserCart/${user.id}`,
          {
            method: "DELETE",
          }
        );
        const clearData = await clearRes.json();

        if (clearData.success) {
          await Swal.fire({
            title: "Success",
            text: "Your order has been placed!",
            icon: "success",
            customClass: "swal2-popup-custom",
          });
          window.location.href = "/primestore";
        }
      } else {
        await Swal.fire({
          title: "Error",
          text: "Failed to place order. Please try again.",
          icon: "error",
          customClass: "swal2-popup-custom",
        });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      await Swal.fire({
        title: "Error",
        text: "Something went wrong. Please try again.",
        icon: "error",
        customClass: "swal2-popup-custom",
      });
    }
  }

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
          customClass: "swal2-popup-custom",
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
            await Swal.fire({
              title: "Error",
              text: error.message,
              icon: "error",
              customClass: "swal2-popup-custom",
            });
          } else {
            await placeOrder(finalTotal, method);
          }
        } else {
          await Swal.fire({
            title: "Error",
            text: paymentResult.error,
            icon: "error",
            customClass: "swal2-popup-custom",
          });
        }
      }
    });
  });

  const userdata = await fetchUserAddress();
  if (userdata) {
    renderAddress(userdata);
  }
});
