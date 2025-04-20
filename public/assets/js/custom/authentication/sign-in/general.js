"use strict";
var KTSigninGeneral = (function () {
  var e, t, i;
  return {
    init: function () {
      e = document.querySelector("#kt_sign_in_form");
      t = document.querySelector("#kt_sign_in_submit");

      i = FormValidation.formValidation(e, {
        fields: {
          email: {
            validators: {
              regexp: {
                regexp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email-address",
              },
              notEmpty: { message: "Email address is required" },
            },
          },
          password: {
            validators: {
              notEmpty: { message: "The password is required" },
            },
          },
        },
        plugins: {
          trigger: new FormValidation.plugins.Trigger(),
          bootstrap: new FormValidation.plugins.Bootstrap5({
            rowSelector: ".fv-row",
            eleInvalidClass: "",
            eleValidClass: "",
          }),
        },
      });

      const errorMessage = document.body.dataset.errorMessage;
      console.log(errorMessage);
      if (errorMessage !== "undefined" && errorMessage.trim() !== "") {
        Swal.fire({
          text: "You must login to visit this Page!!",
          icon: "warning",
          buttonsStyling: false,
          confirmButtonText: "Ok, got it!",
          customClass: { confirmButton: "btn btn-primary" },
        });
      }

      // 🔐 Handle login button click
      t.addEventListener("click", function (n) {
        n.preventDefault();
        i.validate().then(function (i) {
          if (i === "Valid") {
            t.setAttribute("data-kt-indicator", "on");
            t.disabled = true;

            fetch("api/auth/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: e.querySelector('[name="email"]').value,
                password: e.querySelector('[name="password"]').value,
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.success) {
                  localStorage.setItem("token", data.token);
                  localStorage.setItem("user", JSON.stringify(data.user));

                  //Call updateStatus API
                  const userId = data.user.id;
                  fetch(
                    `http://localhost:3000/api/user/updateStatus/${userId}`,
                    {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${data.token}`,
                      },
                    }
                  )
                    .then((res) => res.json())
                    .then((statusData) => {
                      console.log("User status updated:", statusData);
                    })
                    .catch((err) => {
                      console.error("Status update failed:", err);
                    });

                  t.removeAttribute("data-kt-indicator");
                  t.disabled = false;

                  Swal.fire({
                    text: "You have successfully logged in!",
                    icon: "success",
                    buttonsStyling: false,
                    confirmButtonText: "Ok, got it!",
                    customClass: { confirmButton: "btn btn-primary" },
                  }).then(function (t) {
                    if (t.isConfirmed) {
                      e.querySelector('[name="email"]').value = "";
                      e.querySelector('[name="password"]').value = "";
                      var redirectUrl = e.getAttribute("data-kt-redirect-url");
                      if (redirectUrl) location.href = redirectUrl;
                      else location.href = "/admin/dashboard";
                    }
                  });
                } else {
                  Swal.fire({
                    text: data.message || "Login failed. Please try again.",
                    icon: "error",
                    buttonsStyling: false,
                    confirmButtonText: "Ok, got it!",
                    customClass: { confirmButton: "btn btn-primary" },
                  });
                  t.removeAttribute("data-kt-indicator");
                  t.disabled = false;
                }
              })
              .catch((error) => {
                console.error("Login Error:", error);
                Swal.fire({
                  text: "Something went wrong. Please try again later.",
                  icon: "error",
                  buttonsStyling: false,
                  confirmButtonText: "Ok, got it!",
                  customClass: { confirmButton: "btn btn-primary" },
                });
                t.removeAttribute("data-kt-indicator");
                t.disabled = false;
              });
          } else {
            Swal.fire({
              text: "Please fix the errors in the form and try again.",
              icon: "error",
              buttonsStyling: false,
              confirmButtonText: "Ok, got it!",
              customClass: { confirmButton: "btn btn-primary" },
            });
          }
        });
      });

      // 👁️ Password visibility toggle
      const passwordInput = document.querySelector('input[name="password"]');
      const toggleBtn = document.querySelector(
        '[data-kt-password-meter-control="visibility"]'
      );
      if (toggleBtn) {
        const eyeIcon = toggleBtn.querySelector(".bi-eye");
        const eyeSlashIcon = toggleBtn.querySelector(".bi-eye-slash");

        toggleBtn.addEventListener("click", function () {
          const isPassword = passwordInput.type === "password";
          passwordInput.type = isPassword ? "text" : "password";
          eyeIcon.classList.toggle("d-none", !isPassword);
          eyeSlashIcon.classList.toggle("d-none", isPassword);
        });
      }
    },
  };
})();
KTUtil.onDOMContentLoaded(function () {
  KTSigninGeneral.init();
});
