"use strict";

var KTAuthResetPassword = (function () {
  let form,
    submitButton,
    cancelButton,
    otpSection,
    verifyOtpBtn,
    otpTimerInterval;
  let resendOtpLink;
  let emailInput, emailError;
  let otpInputs;

  // Clear email error message
  function clearEmailError() {
    emailError.textContent = "";
    emailInput.classList.remove("is-invalid");
  }

  // Show email error message
  function showEmailError(msg) {
    emailError.textContent = msg;
    emailInput.classList.add("is-invalid");
  }

  // Validate email format and presence
  function validateEmail() {
    const email = emailInput.value.trim();
    if (!email) {
      showEmailError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showEmailError("Invalid email address");
      return false;
    }
    clearEmailError();
    return true;
  }

  // Start the OTP resend timer (default 60 seconds)
  function startOTPTimer(duration = 300) {
    let timeLeft = duration;
    const timerEl = document.getElementById("otp_timer");
    timerEl.textContent = `Resend OTP in ${timeLeft}s`;

    otpTimerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft > 0) {
        timerEl.textContent = `Resend OTP in ${timeLeft}s`;
      } else {
        clearInterval(otpTimerInterval);
        timerEl.innerHTML = `<a href="#" id="resend_otp_link">Resend OTP</a>`;
        resendOtpLink = document.getElementById("resend_otp_link");
        resendOtpLink.addEventListener("click", async (e) => {
          e.preventDefault();
          await resendOtp();
        });
      }
    }, 1000);
  }

  // Resend OTP API call and restart timer
  async function resendOtp() {
    const email = emailInput.value.trim();
    if (!email) {
      Swal.fire("Error", "Email is required to resend OTP.", "error");
      return;
    }

    try {
      const res = await fetch("/api/auth/user/sendotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || !data.success)
        throw new Error(data.message || "Failed to resend OTP");

      Swal.fire(
        "OTP Resent",
        "A new OTP has been sent to your email.",
        "success"
      );
      startOTPTimer();
    } catch (err) {
      Swal.fire("Error", err.message || "Could not resend OTP", "error");
    }
  }

  // Show OTP input section and toggle buttons
  function showOtpSection() {
    otpSection.classList.remove("d-none");
    submitButton.classList.add("d-none");
    verifyOtpBtn.classList.remove("d-none");
    verifyOtpBtn.disabled = false;
    emailInput.setAttribute("disabled", true);
  }

  // Reset form to initial state
  function resetFormToInitialState() {
    form.reset();
    clearEmailError();
    emailInput.removeAttribute("disabled");
    submitButton.classList.remove("d-none");
    verifyOtpBtn.classList.add("d-none");
    otpSection.classList.add("d-none");

    otpInputs.forEach((input) => (input.value = ""));
    clearInterval(otpTimerInterval);
    const timerEl = document.getElementById("otp_timer");
    if (timerEl) timerEl.textContent = "";
  }

  // Handle submit button click: validate email, send OTP, show OTP section
  function handleSubmit() {
    submitButton.addEventListener("click", async (e) => {
      e.preventDefault();

      if (!validateEmail()) {
        emailInput.focus();
        return;
      }

      submitButton.setAttribute("data-kt-indicator", "on");
      submitButton.disabled = true;

      try {
        const email = emailInput.value.trim();

        const res = await fetch("/api/auth/user/sendotp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (!res.ok || !data.success)
          throw new Error(data.message || "Something went wrong");

        Swal.fire("OTP Sent", "Check your email for the OTP code.", "success");

        showOtpSection();
        startOTPTimer();
        otpInputs.forEach((input) => (input.value = ""));
        otpInputs[0].focus();
      } catch (err) {
        Swal.fire("Error", err.message || "Email not found", "error");
      } finally {
        submitButton.removeAttribute("data-kt-indicator");
        submitButton.disabled = false;
      }
    });
  }

  // Live validate email on input
  function handleEmailInputLiveValidation() {
    emailInput.addEventListener("input", () => {
      validateEmail();
    });
  }

  // Manage OTP inputs: move focus on input, backspace, and submit on Enter
  function handleOTPInputs() {
    otpInputs.forEach((input, index) => {
      input.addEventListener("input", (e) => {
        const value = e.target.value;
        if (/^\d$/.test(value)) {
          if (index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
          }
        } else {
          input.value = "";
        }
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !input.value && index > 0) {
          otpInputs[index - 1].focus();
        }
        if (e.key === "Enter") {
          e.preventDefault();
          if (!verifyOtpBtn.disabled) verifyOtpBtn.click();
        }
      });
    });
  }

  // Handle OTP verification button click and redirect on success
  function handleOTPVerification() {
    verifyOtpBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const otp = Array.from(otpInputs)
        .map((input) => input.value.trim())
        .join("");

      if (otp.length < 4 || !/^\d{4}$/.test(otp)) {
        Swal.fire(
          "Invalid OTP",
          "Please enter the full 4-digit OTP.",
          "warning"
        );
        return;
      }

      const email = emailInput.value.trim();

      verifyOtpBtn.disabled = true;
      verifyOtpBtn.setAttribute("data-kt-indicator", "on");

      try {
        const res = await fetch("/api/auth/user/verifyotp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        });
        const data = await res.json();
        if (!res.ok || !data.success)
          throw new Error(data.message || "OTP verification failed");
        Swal.fire({
          text: "OTP verified successfully..",
          icon: "success",
          timer: 1000,
          buttonsStyling: false,
          confirmButtonText: "Ok, got it!",
          customClass: { confirmButton: "btn btn-primary" },
        }).then(() => {
          window.location.href = `/user/resetpassword?email=${encodeURIComponent(
            email
          )}`;
        });
      } catch (err) {
        Swal.fire("Error", err.message || "OTP verification failed", "error");
        verifyOtpBtn.disabled = false;
        verifyOtpBtn.removeAttribute("data-kt-indicator");
      }
    });
  }

  // Cancel button resets form to initial state
  function handleCancel() {
    cancelButton.addEventListener("click", (e) => {
      e.preventDefault();
      resetFormToInitialState();
    });
  }

  return {
    init: function () {
      form = document.querySelector("#kt_password_reset_form");
      submitButton = document.querySelector("#kt_password_reset_submit");
      cancelButton = document.querySelector("#kt_password_reset_cancel");
      otpSection = document.getElementById("otp_section");
      verifyOtpBtn = document.getElementById("kt_password_verify_otp");
      emailInput = form.querySelector('[name="email"]');

      emailError = form.querySelector(".email-error");
      if (!emailError) {
        emailError = document.createElement("div");
        emailError.className = "invalid-feedback email-error";
        emailInput.insertAdjacentElement("afterend", emailError);
      }

      otpInputs = document.querySelectorAll(".otp-input");

      handleSubmit();
      handleEmailInputLiveValidation();
      handleOTPInputs();
      handleOTPVerification();
      handleCancel();
    },
  };
})();

KTUtil.onDOMContentLoaded(function () {
  KTAuthResetPassword.init();
});
