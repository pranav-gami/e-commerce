document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("kt_category_add_form");
  const submitButton = document.getElementById("kt_category_add_submit");
  const imageInput = document.getElementById("categoryImageUpload");
  const imageWrapper = document.getElementById("categoryImageWrapper");

  const token = localStorage.getItem("token");

  function resetImage() {
    imageWrapper.style.backgroundImage = "none";
    imageWrapper.classList.add("image-input-empty");
  }

  imageInput.addEventListener("change", function () {
    const file = imageInput.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imageWrapper.style.backgroundImage = `url('${e.target.result}')`;
        imageWrapper.classList.remove("image-input-empty");
      };
      reader.readAsDataURL(file);
    } else {
      resetImage();
    }
  });

  // Form submit handler
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const categoryName = form
      .querySelector('input[name="category_name"]')
      .value.trim();

    // Validate
    if (!categoryName || imageInput.files.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Category name and image fields are required.",
        confirmButtonText: "Ok, got it!",
        customClass: { confirmButton: "btn btn-primary" },
      });
      return;
    }

    const formData = new FormData();
    formData.append("categoryName", categoryName);
    formData.append("image", imageInput.files[0]);

    const result = await Swal.fire({
      title: "Add New Category?",
      text: "Are you sure you want to add this category?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, add it!",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-light",
      },
    });

    if (!result.isConfirmed) return;

    submitButton.setAttribute("data-kt-indicator", "on");
    submitButton.disabled = true;

    try {
      const response = await fetch("/api/category/addCategory", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const resData = await response.json();
      submitButton.removeAttribute("data-kt-indicator");
      submitButton.disabled = false;

      if (resData.success) {
        Swal.fire({
          icon: "success",
          title: "Category Added!",
          text: "The category has been successfully Added.",
          confirmButtonText: "Ok, got it!",
          customClass: { confirmButton: "btn btn-primary" },
        }).then(() => {
          window.location.href = "/admin/categories";
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            resData.message || "Something went wrong while adding category.",
          confirmButtonText: "Ok, got it!",
          customClass: { confirmButton: "btn btn-primary" },
        });
      }
    } catch (error) {
      console.error(error);
      submitButton.removeAttribute("data-kt-indicator");
      submitButton.disabled = false;

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Failed to submit. Please try again later.",
        confirmButtonText: "Ok, got it!",
        customClass: { confirmButton: "btn btn-primary" },
      });
    }
  });
});
