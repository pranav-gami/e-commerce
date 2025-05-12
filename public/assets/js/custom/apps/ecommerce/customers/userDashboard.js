document.addEventListener("DOMContentLoaded", () => {
  let user = JSON.parse(localStorage.getItem("user"));

  const links = document.querySelectorAll(".sidebar_nav a");
  const sections = document.querySelectorAll(".section");
  const pageTitle = document.querySelector(".page_title");
  const toggleBtn = document.querySelector(".menu_toggle");
  const sidebar = document.querySelector(".sidebar");
  const editProfileBtn = document.querySelector(".profile_Edit_Btn");
  const profileForm = document.getElementById("profile-form");

  const activateSection = (sectionId) => {
    links.forEach((link) => {
      link.classList.toggle("active", link.dataset.section === sectionId);
    });

    sections.forEach((section) => {
      section.classList.toggle("active", section.id === sectionId);
    });

    const activeLink = Array.from(links).find(
      (link) => link.dataset.section === sectionId
    );
    if (activeLink) {
      pageTitle.textContent = activeLink.textContent;
    }

    sidebar.classList.remove("open");
  };

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const sectionId = link.dataset.section;
      activateSection(sectionId);
    });
  });

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", () => {
      activateSection("profile");
    });
  }

  // FETCH USER'S DETIALS
  const loadUserDashboardData = async () => {
    try {
      const response = await fetch(`/api/user/getUser/${user.id}`, {
        method: "GET",
      });
      if (!response.ok) throw new Error("Failed to fetch user data.");

      const data = await response.json();
      populateUserDetails(data.data);
      // populateOrders(data.orders); // Fetch + populate orders
    } catch (error) {
      Swal.fire("Error", "Failed to load user data.", "error");
    }
  };

  const populateUserDetails = (user) => {
    document.querySelector(".user_name").textContent = user.username;
    document.querySelector(".user_email").textContent = user.email;
    document.querySelector(".user_phone").textContent = user.phone;
    document.querySelector(".user_status").textContent = user.isActive
      ? "Active"
      : "Inactive";
    document
      .querySelector(".user_status")
      .classList.toggle("active", user.isActive);

    const address = user.address ? user.address.split(",") : [];
    const area = address[0]?.trim() || "";
    const city = address[1]?.trim() || "";
    const district = address[2]?.trim() || "";
    const pin = address[3]?.replace("PIN:", "").trim() || "";

    document.querySelector(".user_area").textContent = area;
    document.querySelector(".user_city").textContent = city;
    document.querySelector(".user_district").textContent = district;
    document.querySelector(".user_pin").textContent = pin;

    document.getElementById("name").value = user.username;
    document.getElementById("email").value = user.email;
    document.getElementById("phone").value = user.phone;
    document.getElementById("area").value = area;
    document.getElementById("city").value = city;
    document.getElementById("district").value = district;
    document.getElementById("pin").value = pin;
  };

  //  FETCH & DISPLAY ORDERS
  // const populateOrders = async (ordersFromUserApi = null) => {
  //   try {
  //     let orders = ordersFromUserApi;

  //     if (!orders) {
  //       const res = await fetch(`/api/order/getOrdersByUser/${user.id}`);
  //       if (!res.ok) throw new Error("Failed to fetch orders");
  //       const data = await res.json();
  //       orders = data.orders;
  //     }

  //     const orderList = document.querySelector(".order-list");
  //     orderList.innerHTML = "";

  //     if (!orders || orders.length === 0) {
  //       orderList.innerHTML = "<p>No orders found.</p>";
  //       return;
  //     }

  //     orders.forEach((order) => {
  //       // If multiple products per order, loop products
  //       order.products.forEach((product) => {
  //         const orderCard = document.createElement("div");
  //         orderCard.classList.add("order-card", order.status.toLowerCase());

  //         const statusText =
  //           order.status === "Delivered"
  //             ? "Delivered on " + new Date(order.orderDate).toLocaleDateString()
  //             : order.status === "Cancelled"
  //             ? "Cancelled on " + new Date(order.orderDate).toLocaleDateString()
  //             : "Ordered on " + new Date(order.orderDate).toLocaleDateString();

  //         orderCard.innerHTML = `
  //           <div class="order-status">${order.status}</div>
  //           <img src="${product.image}" alt="Product Image">
  //           <div class="order-info">
  //             <h4>${product.title}</h4>
  //             <p>Price: ₹${product.price}</p>
  //             <p class="order-date">${statusText}</p>
  //           </div>
  //         `;
  //         orderList.appendChild(orderCard);
  //       });
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     Swal.fire("Error", "Failed to load orders.", "error");
  //   }
  // };

  //  EDIT PROFILE: VALIDATION & UPDATE OR CANCEL
  profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const area = document.getElementById("area").value.trim();
    const city = document.getElementById("city").value.trim();
    const district = document.getElementById("district").value.trim();
    const pin = document.getElementById("pin").value.trim();

    // Simple validation
    if (!name || !email || !phone || !area || !city || !district || !pin) {
      return Swal.fire(
        "Validation Error",
        "All fields are required.",
        "warning"
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const pinRegex = /^[0-9]{6}$/;

    if (!emailRegex.test(email)) {
      return Swal.fire("Validation Error", "Enter a valid email.", "warning");
    }

    if (!phoneRegex.test(phone)) {
      return Swal.fire(
        "Validation Error",
        "Phone must be 10 digits.",
        "warning"
      );
    }

    if (!pinRegex.test(pin)) {
      return Swal.fire("Validation Error", "PIN must be 6 digits.", "warning");
    }

    const fullAddress = `${area}, ${city}, ${district}, PIN: ${pin}`;

    // Confirm update
    const result = await Swal.fire({
      title: "Confirm Update",
      text: "Are you sure you want to save these changes?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, save it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/user/updateUser/${user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: name,
            email: email,
            phone: phone,
            address: fullAddress,
          }),
        });

        if (!res.ok) throw new Error("Failed to update profile.");
        const updatedData = await res.json();

        // Update localStorage with new user data
        localStorage.setItem("user", JSON.stringify(updatedData.data));
        user = updatedData.data;
        Swal.fire("Updated!", "Your profile has been updated.", "success");

        loadUserDashboardData();
        activateSection("overview");
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to update profile.", "error");
      }
    }
  });

  const cancelBtn = document.querySelector(".cancel_button");

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      activateSection("overview");
    });
  }

  loadUserDashboardData();
});
