"use strict";

var KTSigninUser = (function () {
  var form, submitButton, validator;

  return {
    init: function () {
      form = document.querySelector("#kt_sign_in_form");
      submitButton = document.querySelector("#kt_sign_in_submit");

      validator = FormValidation.formValidation(form, {
        fields: {
          email: {
            validators: {
              regexp: {
                regexp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
              notEmpty: { message: "Email address is required" },
            },
          },
          password: {
            validators: {
              notEmpty: { message: "Password is required" },
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

      let errorMessage = document.body.dataset.errorMessage;
      let err;
      if (errorMessage == "only_user") {
        err = "Only User can access this Pages!!";
      } else if (errorMessage == "only_admin") {
        err = "Only Admin can access this Pages!!";
      }
      if (errorMessage == "Login") {
        err = "You must Login to access this Page!";
      }
      if (errorMessage !== "undefined" && errorMessage.trim() !== "") {
        Swal.fire({
          text: err,
          icon: "warning",
          buttonsStyling: false,
          confirmButtonText: "Ok, got it!",
          customClass: { confirmButton: "btn btn-primary" },
        });
      }

      submitButton.addEventListener("click", function (e) {
        e.preventDefault();

        validator.validate().then(function (status) {
          if (status === "Valid") {
            submitButton.setAttribute("data-kt-indicator", "on");
            submitButton.disabled = true;

            const email = form.querySelector('[name="email"]').value;
            const password = form.querySelector('[name="password"]').value;

            fetch("/api/auth/user/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.success) {
                  localStorage.setItem("token", data.token);
                  localStorage.setItem("user", JSON.stringify(data.user));

                  // Update user's status
                  fetch(`/api/user/updateStatus/${data.user.id}`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${data.token}`,
                    },
                  }).catch((err) =>
                    console.error("Status update failed:", err)
                  );

                  submitButton.removeAttribute("data-kt-indicator");
                  submitButton.disabled = false;

                  Swal.fire({
                    text: "You have successfully logged in!",
                    icon: "success",
                    buttonsStyling: false,
                    confirmButtonText: "Ok, got it!",
                    customClass: { confirmButton: "btn btn-primary" },
                  }).then(function (result) {
                    if (result.isConfirmed) {
                      form.reset();
                      window.location.href = "/primestore";
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
                  submitButton.removeAttribute("data-kt-indicator");
                  submitButton.disabled = false;
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
                submitButton.removeAttribute("data-kt-indicator");
                submitButton.disabled = false;
              });
          } else {
            Swal.fire({
              text: "Please fill required fileds to Login",
              icon: "error",
              buttonsStyling: false,
              confirmButtonText: "Ok, got it!",
              customClass: { confirmButton: "btn btn-primary" },
            });
          }
        });
      });

      // Password visibility toggle
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
  KTSigninUser.init();
});
