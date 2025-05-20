"use strict";

var KTUserDashboard = (function () {
  let user = null;
  let originalValues = {};

  const statusIconClass = {
    PENDING: "pending-icon",
    DELIVERED: "delivered-icon",
    CANCELLED: "cancelled-icon",
    SHIPPED: "shipped-icon",
  };

  const statusTextClass = {
    PENDING: "status-pending",
    DELIVERED: "status-delivered",
    CANCELLED: "status-cancelled",
    SHIPPED: "status-shipped",
  };

  const formatDate = (isoDateStr) => {
    const date = new Date(isoDateStr);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const populateUserProfile = () => {
    if (!user) return;

    const updateAll = (selector, value) => {
      document.querySelectorAll(selector).forEach((el) => {
        el.textContent = value || "";
      });
    };

    updateAll(".profile_username", user.username);
    updateAll(".profile_email", user.email);
    updateAll(".profile_role", user.role?.toUpperCase() || "USER");

    const avatar = document.querySelector(".user-avatar img");
    if (avatar) avatar.src = user.image || "/assets/media/defaultuser.jpeg";

    const updateInfo = (selector, value) => {
      const element = document.querySelector(selector);
      if (element) element.textContent = value || "";
    };

    const addressParts = user.address?.split(",") || [];
    updateInfo(".profile_phone", user.phone);
    updateInfo(".profile_area", addressParts[0]?.trim());
    updateInfo(".profile_city", addressParts[1]?.trim());
    updateInfo(".profile_district", addressParts[2]?.trim());
    updateInfo(".profile_pincode", addressParts[3]?.replace("PIN:", "").trim());
  };

  const enableEditMode = () => {
    const infoValues = document.querySelectorAll(".info-value");
    infoValues.forEach((el) => {
      const fieldName = el.classList[1]?.replace("profile_", "");
      originalValues[fieldName] = el.textContent.trim();

      const input = document.createElement("input");
      input.type = "text";
      input.value = originalValues[fieldName];
      input.setAttribute("data-field", fieldName);

      el.textContent = "";
      el.appendChild(input);

      // Inserting error Container
      const error = document.createElement("div");
      error.className = "error-message text-danger";
      el.appendChild(error);
    });

    document.getElementById("actionButtons").classList.remove("hidden");
    document.getElementById("editProfileBtn").classList.add("hidden");
  };

  const cancelEditMode = () => {
    Swal.fire({
      icon: "warning",
      title: "Cancel Editing?",
      text: "Are you sure you want to discard changes?",
      showCancelButton: true,
      width: "500px",
      confirmButtonText: "Yes, cancel",
      cancelButtonText: "No, keep editing",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const infoValues = document.querySelectorAll(".info-value");
        infoValues.forEach((el) => {
          const fieldName = el.classList[1]?.replace("profile_", "");
          el.textContent = originalValues[fieldName];
        });

        document.getElementById("actionButtons").classList.add("hidden");
        document.getElementById("editProfileBtn").classList.remove("hidden");
      }
    });
  };

  // const saveProfileUpdates = async () => {
  //   const infoValues = document.querySelectorAll(".info-value");
  //   const updatedUser = {};
  //   const updateUserData = {};

  //   infoValues.forEach((el) => {
  //     const input = el.querySelector("input");
  //     const fieldName = el.classList[1]?.replace("profile_", "");
  //     if (input && fieldName) {
  //       const newValue = input.value.trim();
  //       updatedUser[fieldName] = newValue;
  //       updateUserData[fieldName] = newValue;
  //     }
  //   });

  //   if (
  //     updatedUser.area &&
  //     updatedUser.city &&
  //     updatedUser.district &&
  //     updatedUser.pincode
  //   ) {
  //     updatedUser.address = `${updatedUser.area}, ${updatedUser.city}, ${updatedUser.district}, PIN: ${updatedUser.pincode}`;
  //     updateUserData.address = updatedUser.address;
  //   }

  //   delete updatedUser.area;
  //   delete updatedUser.district;
  //   delete updatedUser.pincode;

  //   updatedUser.role = user.role;
  //   updateUserData.role = user.role;
  //   updateUserData.id = user.id;

  //   const result = await Swal.fire({
  //     icon: "question",
  //     title: "Save Changes?",
  //     text: "Do you want to save these profile changes?",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, save",
  //     cancelButtonText: "No, cancel",
  //     reverseButtons: true,
  //   });

  //   if (!result.isConfirmed) return;

  //   try {
  //     const response = await fetch(`/api/user/updateUser/${user.id}`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(updatedUser),
  //     });

  //     if (!response.ok) throw new Error(await response.text());

  //     infoValues.forEach((el) => {
  //       const fieldName = el.classList[1]?.replace("profile_", "");
  //       const value = updateUserData[fieldName] || "";
  //       el.textContent = value;
  //       document.querySelectorAll(`.profile_${fieldName}`).forEach((e) => {
  //         e.textContent = value;
  //       });
  //     });

  //     localStorage.setItem("user", JSON.stringify(updateUserData));
  //     Swal.fire("Profile Updated", "Your profile has been updated.", "success");

  //     document.getElementById("actionButtons").classList.add("hidden");
  //     document.getElementById("editProfileBtn").classList.remove("hidden");
  //   } catch (error) {
  //     console.error(error);
  //     Swal.fire("Error", error.message, "error");
  //   }
  // };

  const saveProfileUpdates = async () => {
    const infoValues = document.querySelectorAll(".info-value");
    const updatedUser = {};
    const updateUserData = {};
    let isValid = true;

    infoValues.forEach((el) => {
      const errorContainer = el.querySelector(".error-message");
      if (errorContainer) errorContainer.textContent = "";
    });

    infoValues.forEach((el) => {
      const input = el.querySelector("input");
      const fieldName = el.classList[1]?.replace("profile_", "");
      const errorContainer = el.querySelector(".error-message");

      if (input && fieldName) {
        const newValue = input.value.trim();
        const fieldLabel =
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

        if (!newValue) {
          if (errorContainer)
            errorContainer.textContent = `${fieldLabel} is required`;
          isValid = false;
          return;
        }

        // Validate no commas in address fields
        if (
          ["area", "city", "district", "pincode"].includes(fieldName) &&
          newValue.includes(",")
        ) {
          if (errorContainer)
            errorContainer.textContent = `${fieldLabel} should not contain commas`;
          isValid = false;
          return;
        }

        if (
          fieldName === "email" &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newValue)
        ) {
          if (errorContainer)
            errorContainer.textContent = `Invalid emailId format !`;
          isValid = false;
          return;
        }

        // Validate phone
        if (fieldName === "phone" && !/^\d{10}$/.test(newValue)) {
          if (errorContainer)
            errorContainer.textContent = `Phone must contains only 10 digits`;
          isValid = false;
          return;
        }

        if (fieldName === "pincode" && !/^\d{6}$/.test(newValue)) {
          if (errorContainer)
            errorContainer.textContent = `PIN must have 6 digits`;
          isValid = false;
          return;
        }

        updatedUser[fieldName] = newValue;
        updateUserData[fieldName] = newValue;
      }
    });

    // Final address validation
    const { area, city, district, pincode } = updatedUser;
    if (area && city && district && pincode) {
      updatedUser.address = `${area}, ${city}, ${district}, PIN: ${pincode}`;
      updateUserData.address = updatedUser.address;
    }

    if (!isValid) return; // Stop if validation failed

    // Clean up temporary fields
    delete updatedUser.area;
    delete updatedUser.district;
    delete updatedUser.pincode;

    updatedUser.role = user.role;
    updateUserData.role = user.role;
    updateUserData.id = user.id;

    const result = await Swal.fire({
      icon: "question",
      title: "Save Changes?",
      text: "Do you want to save these profile changes?",
      showCancelButton: true,
      confirmButtonText: "Yes, save",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`/api/user/updateUser/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) throw new Error(await response.text());

      infoValues.forEach((el) => {
        const fieldName = el.classList[1]?.replace("profile_", "");
        const value = updateUserData[fieldName] || "";
        el.textContent = value;
        document.querySelectorAll(`.profile_${fieldName}`).forEach((e) => {
          e.textContent = value;
        });
      });

      localStorage.setItem("user", JSON.stringify(updateUserData));
      Swal.fire("Profile Updated", "Your profile has been updated.", "success");

      document.getElementById("actionButtons").classList.add("hidden");
      document.getElementById("editProfileBtn").classList.remove("hidden");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", error.message, "error");
    }
  };

  const setupCancelOrderButtons = () => {
    const cancelButtons = document.querySelectorAll(".cancel_order");

    cancelButtons.forEach((button) => {
      button.addEventListener("click", async function () {
        const itemId = this.dataset.id;
        if (!itemId) return;

        const confirmCancel = await Swal.fire({
          title: "Cancel Item?",
          text: "Are you sure you want to cancel this item?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, cancel",
        });

        if (!confirmCancel.isConfirmed) return;

        try {
          const response = await fetch(`/api/orderitem/cancel/${itemId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || "Cancel failed");
          }

          // Update the DOM
          // const orderItemEl = button.closest(".order-item");
          // if (!orderItemEl) return;

          // const statusText = orderItemEl.querySelector(".status-text");
          // const statusIcon = orderItemEl.querySelector(".status-icon");
          // if (statusText) {
          //   statusText.textContent = "CANCELLED";
          //   statusText.className = "status-text status-cancelled";
          // }
          // if (statusIcon) {
          //   statusIcon.textContent = "✕";
          //   statusIcon.className = "status-icon cancelled-icon";
          // }

          // const infoText = orderItemEl.querySelector(".order-info");
          // const now = new Date();
          // infoText.textContent = `Cancelled on ${formatDate(
          //   now.toISOString()
          // )} as per your request`;

          // const actions = orderItemEl.querySelector(".order-actions");
          // if (actions) {
          //   actions.innerHTML = `
          //     <div class="order-total">Final Total :<span> ₹${button.dataset.total} </span></div>
          //   `;
          // }
          Swal.fire(
            "Cancelled!",
            "This item has been cancelled.",
            "success"
          ).then(() => {
            location.reload();
          });
        } catch (err) {
          console.error(err);
          Swal.fire("Error", err.message, "error");
        }
      });
    });
  };

  const renderOrders = (orders) => {
    if (orders.length > 0) {
      const container = document.querySelector(".orders-container");
      if (!container) return;
      container.innerHTML = "";

      orders.forEach((order, i) => {
        const itemCount = order.items.length;
        const card = document.createElement("div");
        card.classList.add("order-card");

        card.innerHTML = `
                <button class="toggle-items-btn">
                   <span>Order:${i + 1}
                   (${itemCount} ${itemCount > 1 ? "Items" : "Item"})</span>
                   <div class="order-total">Final Total :<span> ₹${
                     order.totalamount
                   } </span></div>
                   <div class="order-date-main">Placed on ${formatDate(
                     order.orderDate
                   )}</div>
                </button>
                <div class="order-items" style="display: block;"></div>
            `;

        const itemsContainer = card.querySelector(".order-items");

        order.items.forEach((item) => {
          const itemDiv = document.createElement("div");
          itemDiv.classList.add("order-item");
          const ispending =
            order.Payment.paymentMethod == "COD"
              ? "payment_pending"
              : "payment_success";
          const ispaid =
            order.Payment.paymentMethod == "COD" ? "PENDING" : "PAID";
          const status = item.status;
          const iconClass = statusIconClass[status] || "pending-icon";
          const textClass = statusTextClass[status] || "status-pending";

          const isDelivered = status === "DELIVERED";
          const isCancelled = status === "CANCELLED";
          const deliveryDate = new Date(item.updatedAt);
          deliveryDate.setDate(deliveryDate.getDate() + 7);

          const infoText = isDelivered
            ? "Exchange/Return window closes on " +
              formatDate(
                new Date(item.updatedAt).setDate(
                  new Date(item.updatedAt).getDate() + 14
                )
              )
            : isCancelled
            ? ""
            : "Your order has been confirmed and will be shipped soon";

          const dateText = isDelivered
            ? `On ${formatDate(item.updatedAt)}`
            : isCancelled
            ? `On ${formatDate(item.updatedAt)} as per your request`
            : `Expected delivery by ${formatDate(deliveryDate.toISOString())}`;

          const actions = isDelivered
            ? `
          <div class="rating-section">
                            <span class="review-text">Rate & Review to earn Credits</span>
            </div>`
            : isCancelled
            ? ``
            : `
          <div><button class="cancel-button cancel_order" data-id="${item.id}">Cancel Item</button></div>`;

          itemDiv.innerHTML = `
                    <div class="order-status-header">
                        <div class="order-status">
                            <div class="status-icon ${iconClass}">${
            status === "PENDING"
              ? "⋯"
              : status === "DELIVERED"
              ? "✓"
              : status === "CANCELLED"
              ? "✕"
              : "…"
          }</div>
    <span class="status-text ${textClass}">${status}</span>
                        </div>
                        <div class="order-date">${dateText}</div>
                    </div>
                    <div class="order-product">
                        <div class="product-image"><img src="/assets/media/products/${
                          item.image
                        }" alt="${item.title}"></div>
                        <div class="product-details">
                        <div class="product-name">${item.title}</div>
                            <div class="product-brand">Product Price: ₹${
                              item.price
                            }</div>
                            <div class="product-qty">Qty: ${item.quantity}</div>
                            <div class="product-size">Subtotal: ₹${
                              item.quantity * item.price
                            }</div>
                        </div>
                        ${
                          isCancelled
                            ? ""
                            : `<div class="payment-details">
                              <h6 class="" style="padding-bottom: 5px; font-size:14px; color:#333">Payment Detaills</h6>
                              <div class="payment-type"><span>Mode od Payment:</span>${order.Payment.paymentMethod}</div>
                              <div class="payment-status ${ispending}"><span>Payment Status:</span>${ispaid}</div>
                        </div>`
                        }
                    </div>
                    <div class="order-info">${infoText}</div>
                    <div class="order-actions">${actions}</div>
                `;

          itemsContainer.appendChild(itemDiv);
        });

        container.appendChild(card);
      });
      setupCancelOrderButtons();
    } else {
      const container = document.querySelector(".orders-container");
      container.innerHTML = `<div class="not_found">Your order list is empty</div>`;
    }
  };

  return {
    init: function () {
      user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      populateUserProfile();

      document
        .getElementById("editProfileBtn")
        ?.addEventListener("click", enableEditMode);
      document
        .getElementById("cancelBtn")
        ?.addEventListener("click", cancelEditMode);
      document
        .getElementById("saveBtn")
        ?.addEventListener("click", saveProfileUpdates);

      // Fetch and render user's orders
      fetch(`/api/order/orders/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) renderOrders(data.data);
        })
        .catch((err) => console.error("Failed to load orders", err));
    },
  };
})();

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", function () {
  KTUserDashboard.init();
});
