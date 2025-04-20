"use strict";
var KTSignupGeneral = (function () {
  var e,
    t,
    a,
    r,
    s = function () {
      return 100 === r.getScore();
    };
  return {
    init: function () {
      (e = document.querySelector("#kt_sign_up_form")),
        (t = document.querySelector("#kt_sign_up_submit")),
        (r = KTPasswordMeter.getInstance(
          e.querySelector('[data-kt-password-meter="true"]')
        )),
        (a = FormValidation.formValidation(e, {
          fields: {
            username: {
              validators: { notEmpty: { message: "Username is required" } },
            },
            email: {
              validators: {
                regexp: {
                  regexp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please Fill a valid email-address",
                },
                notEmpty: { message: "Email address is required" },
              },
            },
            password: {
              validators: {
                notEmpty: { message: "The password is required" },
                callback: {
                  message: "Please enter valid password",
                  callback: function (e) {
                    if (e.value.length > 0) return s();
                  },
                },
              },
            },
            "confirm-password": {
              validators: {
                notEmpty: { message: "The password confirmation is required" },
                identical: {
                  compare: function () {
                    return e.querySelector('[name="password"]').value;
                  },
                  message: "Password and Confirm Password do not match ",
                },
              },
            },
            toc: {
              validators: {
                notEmpty: {
                  message: "You must accept the terms and conditions",
                },
              },
            },
          },
          plugins: {
            trigger: new FormValidation.plugins.Trigger({
              event: { password: !1 },
            }),
            bootstrap: new FormValidation.plugins.Bootstrap5({
              rowSelector: ".fv-row",
              eleInvalidClass: "",
              eleValidClass: "",
            }),
          },
        })),
        t.addEventListener("click", function (s) {
          s.preventDefault(),
            a.revalidateField("password"),
            a.validate().then(function (a) {
              "Valid" == a
                ? (t.setAttribute("data-kt-indicator", "on"),
                  (t.disabled = !0),
                  // ✅ API CALL GOES HERE
                  fetch("api/user/addUser", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      username: e.querySelector('[name="username"]').value,
                      email: e.querySelector('[name="email"]').value,
                      password: e.querySelector('[name="password"]').value,
                    }),
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      if (data.success) {
                        t.removeAttribute("data-kt-indicator");
                        t.disabled = false;

                        Swal.fire({
                          text: "Account created successfully ",
                          icon: "success",
                          buttonsStyling: !1,
                          confirmButtonText: "Ok, got it!",
                          customClass: { confirmButton: "btn btn-primary" },
                        }).then(function (t) {
                          if (t.isConfirmed) {
                            (e.querySelector('[name="username"]').value = ""),
                              (e.querySelector('[name="email"]').value = ""),
                              (e.querySelector('[name="password"]').value = ""),
                              (e.querySelector(
                                '[name="confirm-password"]'
                              ).value = "");
                            var i = e.getAttribute("data-kt-redirect-url");
                            i && (location.href = "admin/login"); // ✅ redirect if success
                          }
                        });
                      } else {
                        Swal.fire({
                          text:
                            data.message || "Sign Up failed. Please try again.",
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
                      console.error("Signup Error:", error);
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
        }),
        e
          .querySelector('input[name="password"]')
          .addEventListener("input", function () {
            this.value.length > 0 &&
              a.updateFieldStatus("password", "NotValidated");
          });
    },
  };
})();
KTUtil.onDOMContentLoaded(function () {
  KTSignupGeneral.init();
});
