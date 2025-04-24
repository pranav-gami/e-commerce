document.addEventListener("DOMContentLoaded", async () => {
  // Getting category Id
  const categoryId =
    document.querySelector("#kt_app_content").dataset.categoryId;

  const token = localStorage.getItem("token");

  const nameInput = document.querySelector("input[name='category_name_edit']");
  const descInput = document.querySelector(
    "textarea[name='category_description_edit']"
  );
  const imageInput = document.getElementById("categoryImageUploadEdit");
  const imageWrapper = document.getElementById("categoryImageWrapperEdit");
  const form = document.getElementById("kt_category_edit_form");

  let originalCategory = null;

  // Fetch category data
  async function loadCategoryDetails() {
    try {
      const res = await fetch(`/api/category/getCategory/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!data.success) {
        return Swal.fire("Error", "Failed to load category", "error");
      }

      originalCategory = data.data;
      // Fill inputs
      nameInput.value = originalCategory.categoryName || "";

      // Preview image
      const imgUrl = `/assets/media/categories/${originalCategory.image}`;
      imageWrapper.style.backgroundImage = `url('${imgUrl}')`;
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong!", "error");
    }
  }

  await loadCategoryDetails();

  // Handle form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newName = nameInput.value.trim();
    const newDesc = descInput.value.trim();

    const formData = new FormData();
    formData.append("categoryName", newName || originalCategory.categoryName);
    formData.append(
      "description",
      newDesc || originalCategory.description || ""
    );

    const imageFile = imageInput.files[0];
    if (imageFile) {
      const allowedTypes = ["image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(imageFile.type)) {
        return Swal.fire(
          "Invalid File",
          "Only JPG or JPEG images are allowed.",
          "error"
        );
      }
      formData.append("image", imageFile);
    } else {
      try {
        const imageUrl = `/assets/media/categories/${originalCategory.image}`;
        const imageRes = await fetch(imageUrl);
        const blob = await imageRes.blob();
        const file = new File([blob], originalCategory.image, {
          type: blob.type,
        });
        formData.append("image", file);
      } catch (err) {
        return Swal.fire(
          "Error",
          "Failed to retrieve existing image.",
          "error"
        );
      }
    }

    try {
      const res = await fetch(`/api/category/updateCategory/${categoryId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();
      if (!result.success) {
        throw new Error(result.message);
      }

      Swal.fire("Success", "Category updated successfully!", "success").then(
        () => {
          window.location.href = "/admin/categories";
        }
      );
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "Failed to update category", "error");
    }
  });

  // Optional: Cancel button handler
  document
    .getElementById("kt_category_edit_cancel")
    .addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "/admin/categories";
    });
});
