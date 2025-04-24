document.addEventListener("DOMContentLoaded", async function () {
  const form = document.querySelector("form");
  const categorySelect = document.getElementById("categorySelect");
  const imageInput = document.querySelector("#imageUpload");
  const imageWrapper = document.querySelector("#imageWrapper");
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("/api/category/getAllCategories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    const categories = data.data;

    if (data.success && Array.isArray(categories)) {
      categorySelect.innerHTML = `<option></option>`;
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.categoryName;
        categorySelect.appendChild(option);
      });

      if ($(categorySelect).data("select2")) {
        $(categorySelect).select2("destroy").select2();
      } else {
        $(categorySelect).select2();
      }
    } else {
      console.warn("No categories found.");
    }

    //Form Submission Handler
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const name = form
        .querySelector('input[name="product_name"]')
        .value.trim();
      const description = form
        .querySelector('input[name="product_description"]')
        .value.trim();
      const price = form.querySelector('input[name="price"]').value.trim();
      const ratings = form.querySelector('input[name="ratings"]').value;
      const categoryID = categorySelect.value;

      // Validate fields
      if (
        !name ||
        !description ||
        !price ||
        !ratings ||
        !categoryID ||
        imageInput.files.length === 0
      ) {
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: "Please fill all required fields and select an image!",
        });
        return;
      }

      const formData = new FormData();
      formData.append("title", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("rating", ratings);
      formData.append("categoryID", categoryID);
      formData.append("image", imageInput.files[0]);

      try {
        const response = await fetch("/api/products/addProduct", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          Swal.fire({
            icon: "success",
            title: "Product Saved",
            text: "Your product has been saved successfully!",
          }).then(() => {
            const redirectUrl = form.getAttribute("data-kt-redirect");
            if (redirectUrl) {
              window.location.href = redirectUrl;
            } else {
              form.reset();
              categorySelect.value = "";
              $(categorySelect).val(null).trigger("change");
              imageWrapper.style.backgroundImage = "";
              imageWrapper.classList.add("image-input-empty");
            }
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: result.message || "Something went wrong!",
          });
        }
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to submit the product. Please try again later.",
        });
      }
    });
  } catch (err) {
    console.error("Error loading categories:", err);
  }
});
