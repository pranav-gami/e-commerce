document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".sidebar_nav a");
  const sections = document.querySelectorAll(".section");
  const pageTitle = document.querySelector(".page_title");
  const toggleBtn = document.querySelector(".menu_toggle");
  const sidebar = document.querySelector(".sidebar");
  const logoutBtn = document.querySelector(".logout-btn");
  const editProfileBtn = document.querySelector(".profile_Edit_Btn");

  const activateSection = (sectionId) => {
    links.forEach((link) => {
      link.classList.toggle("active", link.dataset.section === sectionId);
    });

    sections.forEach((section) => {
      section.classList.toggle("active", section.id === sectionId);
    });
    // UPDATE HEADER TITLE
    const activeLink = Array.from(links).find(
      (link) => link.dataset.section === sectionId
    );
    if (activeLink) {
      pageTitle.textContent = activeLink.textContent;
    }

    sidebar.classList.remove("open");
  };

  // Tabs click event handlers
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

  logoutBtn.addEventListener("click", () => {
    alert("Logging out...");
    // Example: window.location.href = '/logout';
  });

  // Edit Profile Button inside Overview section
  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", () => {
      activateSection("profile");
    });
  }

  // LOAD USER-DATA
  //   const loadUserDashboardData = async () => {
  //     try {
  //       const response = await fetch("/api/user/dashboard", {
  //         method: "GET",
  //       });
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch user data.");
  //       }

  //       const data = await response.json();
  //       populateUserDetails(data.user);
  //       populateOrders(data.orders);
  //     } catch (error) {
  //       console.error(error);
  //       alert("Failed to load user data.");
  //     }
  //   };

  // Populate user details in overview section
  const populateUserDetails = (user) => {
    document.querySelector(".user-name").textContent = user.name;
    document.querySelector(".user-email").textContent = user.email;
    document.querySelector(".user-phone").textContent = user.phone;
    document.querySelector(".user-role").textContent = user.role;
    document.querySelector(".user-status").textContent = user.active
      ? "Active"
      : "Inactive";
    document
      .querySelector(".user-status")
      .classList.toggle("active", user.active);

    document.querySelector(".user_area").textContent = user.area;
    document.querySelector(".user_city").textContent = user.city;
    document.querySelector(".user_district").textContent = user.district;
    document.querySelector(".user_pin").textContent = user.pin;

    // Also populate Edit Profile form
    document.getElementById("name").value = user.name;
    document.getElementById("email").value = user.email;
    document.getElementById("phone").value = user.phone;
    document.getElementById("role").value = user.role;
    document.getElementById("area").value = user.area;
    document.getElementById("city").value = user.city;
    document.getElementById("district").value = user.district;
    document.getElementById("pin").value = user.pin;
  };

  // Populate orders in orders section
  const populateOrders = (orders) => {
    const orderList = document.querySelector(".order-list");
    orderList.innerHTML = ""; // clear existing orders

    orders.forEach((order) => {
      const orderCard = document.createElement("div");
      orderCard.classList.add("order-card", order.status.toLowerCase());

      orderCard.innerHTML = `
          <div class="order-status">${order.status}</div>
          <img src="${order.image}" alt="Product Image">
          <div class="order-info">
            <h4>${order.productName}</h4>
            <p>Size: ${order.size}</p>
            <p class="order-date">${
              order.status === "Delivered"
                ? "Delivered on " + order.date
                : "Cancelled on " + order.date
            }</p>
          </div>
        `;
      orderList.appendChild(orderCard);
    });
  };

  //   loadUserDashboardData();
});
