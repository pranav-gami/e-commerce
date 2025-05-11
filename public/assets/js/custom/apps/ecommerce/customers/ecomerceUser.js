"use strict";
import { updateCartCount } from "../../../utilities/cartProduct/cartUtils.js";

document.addEventListener("DOMContentLoaded", function () {
  // SETTING UP LOGIN USER'S DETAILS
  const user = JSON.parse(localStorage.getItem("user"));
  const userIcon = document.querySelector(".username-initial");
  const username = document.querySelector(".username");
  const email = document.querySelector(".useremail");

  userIcon.textContent = user.username?.charAt(0).toUpperCase();
  username.textContent = user.username;
  email.textContent = user.email;

  // EVENT-LISNERS FOR CART AND PROFILE ETC BUUTTONS
  const cartBtn = document.querySelector(".cart");

  cartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = `/primestore/cart/${user.id}`;
  });

  // LOGOUT USER FUNCTIOANALITY
  const logoutButton = document.querySelector(".logoutBtn");

  logoutButton.addEventListener("click", function (e) {
    e.preventDefault();
    Swal.fire({
      text: "Are you sure you want to sign out?",
      icon: "warning",
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonText: "Yes, sign out",
      cancelButtonText: "Cancel",
      customClass: {
        customClass: "swal2-popup-custom",
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-active-light",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        })
          .then((res) => res.json())
          .then((data) => {
            const userId = user.id;
            fetch(`/api/user/updateStatus/${userId}`, {
              method: "PUT",
            })
              .then((res) => res.json())
              .then((statusData) => {
                console.log("User status updated:", statusData);
              })
              .catch((err) => {
                console.error("Status update failed:", err);
              });
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/user/login";
          })
          .catch((err) => {
            console.error("Logout failed", err);
            Swal.fire({
              title: "Oops!",
              text: "Logout failed. Try again.",
              icon: "error",
              customClass: "swal2-popup-custom",
            });
          });
      }
    });
  });

  // MAKING DYNAMIC HEADER

  async function fetchCategories() {
    try {
      const res = await fetch("/api/category/getAllCategories");
      const data = await res.json();
      if (data.success) {
        renderHeaderMenu(data.data);
        renderMobileMenu(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  function renderHeaderMenu(categories) {
    const headerMenu = document.querySelector(".header__menubar-list");
    headerMenu.innerHTML = "";

    // Add Home Link
    const homeLi = document.createElement("li");
    homeLi.classList.add("header__menubar-link");
    homeLi.innerHTML = `<a href="/primestore" class="header__menubar-item">Home</a>`;
    headerMenu.appendChild(homeLi);

    categories.forEach((cat) => {
      const catLi = document.createElement("li");
      catLi.classList.add("header__menubar-link");
      // RENDERING SUBCATEGORY
      const categoryHTML = `
            <a href="" class="header__menubar-item">${cat.categoryName}</a>
            <ul class="dropdown_list">
                  ${cat.Subcategory.map(
                    (sub) =>
                      `<li class="dropdown_item"><a href="/primestore/category/${cat.id}">${sub.name}</a></li>`
                  ).join("")}
            </ul>
        `;
      catLi.innerHTML = categoryHTML;
      headerMenu.appendChild(catLi);
    });
  }

  function renderMobileMenu(categories) {
    const mobileMenu = document.querySelector(".mobile_menu-category");
    mobileMenu.innerHTML = "";
    // Add Home Button(It don't Subcategories)
    const homeLi = document.createElement("li");
    homeLi.classList.add("menu__list-item");
    homeLi.innerHTML = `<button class="mob_menu-btn menu__title" href="/primestore">Home</button>`;
    mobileMenu.appendChild(homeLi);

    categories.forEach((cat) => {
      const catLi = document.createElement("li");
      catLi.classList.add("menu__list-item");
      // Rendering subcategories For Mobile Menu
      const subListHTML = cat.Subcategory.map(
        (sub) => `
            <li class="menu_hid-item"><a href="/primestore/category/${cat.id}">${sub.name}</a></li>
        `
      ).join("");
      catLi.innerHTML = `
            <button class="mob_menu-btn" data-accordian-btn>
                <p class="menu__title">${cat.categoryName}</p>
                <div>
                    <ion-icon name="add-outline" class="add-icon"></ion-icon>
                    <ion-icon name="remove-outline" class="remove-icon"></ion-icon>
                </div>
            </button>
            <ul class="menu_hidden_list" data-accordian-menu>
                ${subListHTML}
            </ul>
        `;

      mobileMenu.appendChild(catLi);
    });
  }

  // MOBILE NAVIGATION
  const mobileMenuBtn = document.querySelector("[mobile-menu-open]");
  const mobileMenu = document.querySelector("[mobile-menu]");
  const mobileMenuCloseBtn = document.querySelector(".mob_menucls-btn");
  const overlay = document.querySelector(".overlay");

  mobileMenuBtn.addEventListener("click", function () {
    console.log("Mobile Menu Opened.");
    mobileMenu.classList.add("active");
    overlay.classList.add("active");
  });

  const closeMenu = () => {
    console.log("Mobile Menu closed.");
    overlay.classList.remove("active");
    mobileMenu.classList.remove("active");
  };

  mobileMenuCloseBtn.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);

  // MOBILE NAVIGATION CATEGORY (ON CLICKING PARTICULAR BUTTONS LISI SHOULD BE VISIBLE)
  const mobileCategoryLisners = function () {
    const dataAcoordianBtn = document.querySelectorAll("[data-accordian-btn]");
    const dataAcoordianMenu = document.querySelectorAll(
      "[data-accordian-menu]"
    );
    const addIcon = document.querySelectorAll(".add-icon");
    const removeIcon = document.querySelectorAll(".remove-icon");

    for (let i = 0; i < dataAcoordianBtn.length; i++) {
      dataAcoordianBtn[i].addEventListener("click", function () {
        // CLOSE ANOTHER ACTIVE MENU OR ACCORDIAN
        for (let j = 0; j < dataAcoordianMenu.length; j++) {
          if (j !== i) {
            // EXCLUDE CLICKED BUTTON
            dataAcoordianMenu[j].classList.remove("active");
            addIcon[j].style.display = "block";
            removeIcon[j].style.display = "none";
          }
        }
        // TOGGLES ONLY CLICKED ONE BUTTON
        let isActive = dataAcoordianMenu[i].classList.toggle("active");
        if (isActive) {
          removeIcon[i].style.display = "block";
          addIcon[i].style.display = "none";
        } else {
          removeIcon[i].style.display = "none";
          addIcon[i].style.display = "block";
        }
      });
    }
  };

  const searchInput = document.querySelector(".main_search");
  const searchButton = document.querySelector(".header__search-btn");

  // Function to handle search
  function handleSearch() {
    const query = searchInput.value.trim();
    if (query) {
      window.location.href = `/primestore/search?q=${encodeURIComponent(
        query
      )}`;
    }
  }

  searchInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  });

  searchButton.addEventListener("click", function () {
    handleSearch();
  });

  fetchCategories().then(() => {
    mobileCategoryLisners();
    updateCartCount();
  });
});
