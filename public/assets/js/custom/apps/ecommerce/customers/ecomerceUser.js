"use strict";

document.addEventListener("DOMContentLoaded", function () {
  // MOBILE NAVIGATION  (MOBILE MENU AND SIDE MENU)
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
  const dataAcoordianBtn = document.querySelectorAll("[data-accordian-btn]");
  const dataAcoordianMenu = document.querySelectorAll("[data-accordian-menu]");
  const addIcon = document.querySelectorAll(".add-icon");
  const removeIcon = document.querySelectorAll(".remove-icon");

  for (let i = 0; i < dataAcoordianBtn.length; i++) {
    dataAcoordianBtn[i].addEventListener("click", function () {
      // CLOSE ANOTHER ACTIVE MENU OR ACCORDIAN
      for (let j = 0; j < dataAcoordianMenu.length; j++) {
        if (j !== i) {
          // EXCLUDE CLICK BUTTON
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

  // SETTING UP LOGIN USER'S DETAILS
  const user = JSON.parse(localStorage.getItem("user"));
  const userIcon = document.querySelector(".username-initial");
  const username = document.querySelector(".login_username");
  const email = document.querySelector(".login_useremail");

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
  const logoutButton = document.querySelector(".logout");

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
            Swal.fire("Oops!", "Logout failed. Try again.", "error");
          });
      }
    });
  });
});
