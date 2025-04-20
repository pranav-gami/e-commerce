"use strict";
var KTProfileGeneral = (function () {
  var t, e, i, o;
  return {
    init: function () {
      var userData = JSON.parse(localStorage.getItem("user"));

      // MANIPULATING USER DATA(PROFILE SECTION)
      if (userData) {
        const nameElement = document.querySelector(".formname");
        if (nameElement) {
          nameElement.textContent = userData.username || "Max Smith";
        }

        const emailEle = document.querySelector(".formemail");
        console.log(emailEle);
        if (emailEle) {
          emailEle.textContent = userData.email || "max@kt.com";
        }

        const roleElement = document.querySelector(".formrole");
        console.log(roleElement);
        if (roleElement) {
          roleElement.textContent = userData.role || "ADMIN";
        }

        const addressElement = document.querySelector(".formaddress");
        if (addressElement) {
          addressElement.textContent = userData.address || "Ahemdabad,Gujrat";
        }

        // FORM SECTION DATA MANIPULATE
        const fullNameElement = document.querySelector(".fullname");
        if (fullNameElement) {
          fullNameElement.textContent = userData.username || "N/A";
        }

        const companyElement = document.querySelector(".company");
        if (companyElement) {
          companyElement.textContent = userData.company || "E-Commerce";
        }

        const contactPhoneElement = document.querySelector(".contact");
        if (contactPhoneElement) {
          contactPhoneElement.textContent = userData.phone || "+91 9876543210";
        }

        const emailElement = document.querySelector(".emailId");
        if (emailElement) {
          emailElement.textContent = userData.email || "N/A";
        }

        var allowChangesElement = document.querySelector(".canchange");
        if (allowChangesElement) {
          allowChangesElement.textContent =
            userData.role == "ADMIN" ? "Yes" : "No";
        }
      }

      // Sticky navigation for profile page (keeping this if needed)
      o = document.querySelector("#kt_user_profile_nav");
      if (
        o &&
        o.getAttribute("data-kt-sticky") &&
        KTUtil.isBreakpointUp("lg")
      ) {
        if ("1" === localStorage.getItem("nav-initialized")) {
          window.scroll({
            top: parseInt(o.getAttribute("data-kt-page-scroll-position")),
            behavior: "smooth",
          });
        }
        localStorage.setItem("nav-initialized", "1");
      }
    },
  };
})();

// Initialize the profile page JS on DOMContentLoaded
KTUtil.onDOMContentLoaded(function () {
  KTProfileGeneral.init();
});
