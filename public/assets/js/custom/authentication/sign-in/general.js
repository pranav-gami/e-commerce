"use strict";
var KTSigninGeneral = (function () {
  var e, t, i;
  return {
    init: function () {
      (e = document.querySelector("#kt_sign_in_form")),
        (t = document.querySelector("#kt_sign_in_submit")),
        (i = FormValidation.formValidation(e, {
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
              validators: { notEmpty: { message: "The password is required" } },
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
        })),
        t.addEventListener("click", function (n) {
          n.preventDefault(),
            i.validate().then(function (i) {
              "Valid" == i
                ? (t.setAttribute("data-kt-indicator", "on"),
                  (t.disabled = !0),
                  // ✅ API CALL GOES HERE
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
                        console.log(data.user);
                        t.removeAttribute("data-kt-indicator");
                        t.disabled = false;

                        Swal.fire({
                          text: "You have successfully logged in!",
                          icon: "success",
                          buttonsStyling: !1,
                          confirmButtonText: "Ok, got it!",
                          customClass: { confirmButton: "btn btn-primary" },
                        }).then(function (t) {
                          if (t.isConfirmed) {
                            (e.querySelector('[name="email"]').value = ""),
                              (e.querySelector('[name="password"]').value = "");
                            var i = e.getAttribute("data-kt-redirect-url");
                            i && (location.href = "/"); // ✅ redirect if success
                          }
                        });
                      } else {
                        Swal.fire({
                          text:
                            data.message || "Login failed. Please try again.",
                          icon: "error",
                          buttonsStyling: !1,
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
                        buttonsStyling: !1,
                        confirmButtonText: "Ok, got it!",
                        customClass: { confirmButton: "btn btn-primary" },
                      });
                      t.removeAttribute("data-kt-indicator");
                      t.disabled = false;
                    }))
                : Swal.fire({
                    text: "Sorry, looks like there are some errors detected, please try again.",
                    icon: "error",
                    buttonsStyling: !1,
                    confirmButtonText: "Ok, got it!",
                    customClass: { confirmButton: "btn btn-primary" },
                  });
            });
        });
    },
  };
})();
KTUtil.onDOMContentLoaded(function () {
  KTSigninGeneral.init();
});
