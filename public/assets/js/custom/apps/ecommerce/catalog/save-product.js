document.addEventListener("DOMContentLoaded", async function () {
  const form = document.querySelector("form");
  const subcategorySelect = document.getElementById("subcategorySelect");
  const imageInput = document.querySelector("#imageUpload");
  const imageWrapper = document.querySelector("#imageWrapper");

  try {
    const res = await fetch("/api/subcategory/getAllSubcategories");
    const data = await res.json();
    const subcategories = data.data;

    if (data.success && Array.isArray(subcategories)) {
      subcategorySelect.innerHTML = `<option></option>`;
      subcategories.forEach((sub) => {
        const option = document.createElement("option");
        option.value = sub.id;
        option.textContent = sub.name;
        option.setAttribute("data-category-id", sub.categoryId);
        subcategorySelect.appendChild(option);
      });

      if ($(subcategorySelect).data("select2")) {
        $(subcategorySelect).select2("destroy").select2();
      } else {
        $(subcategorySelect).select2();
      }
    } else {
      console.warn("No Subcategories found.");
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
      const subcategoryId = subcategorySelect.value;
      const categoryID =
        subcategorySelect.selectedOptions[0].dataset.categoryId;

      // Validate-fields
      if (
        !name ||
        !description ||
        !price ||
        !ratings ||
        !categoryID ||
        !subcategoryId ||
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
      formData.append("subcategoryId", subcategoryId);
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
              s.value = "";
              $(subcategorySelect).val(null).trigger("change");
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
