document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("edit_product_form");
  const imageInput = document.getElementById("edit_image");
  const imagePreviewWrapper = document.getElementById(
    "edit_image_preview_wrapper"
  );
  let originalProductData = {};
  const token = localStorage.getItem("token");

  const getProductIdFromUrl = () => {
    const productId =
      document.querySelector("#kt_app_content").dataset.productId;
    console.log("Product ID:", productId);
    return productId;
  };

  const fetchCategories = async (selectedCategoryID) => {
    try {
      const res = await fetch("/api/category/getAllCategories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      const categorySelect = document.getElementById("edit_categoryID");

      categorySelect.innerHTML = `<option value="" disabled>Select an option</option>`;
      json.data.forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.categoryName;
        if (cat.id === selectedCategoryID) {
          option.selected = true;
        }
        categorySelect.appendChild(option);
      });
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const fetchProductData = async (id) => {
    try {
      const res = await fetch(`/api/products/getProduct/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      const product = json.data;
      originalProductData = { ...product };

      document.getElementById("edit_product_id").value = product.id;
      document.getElementById("edit_title").value = product.title;
      document.getElementById("edit_description").value = product.description;
      document.getElementById("edit_price").value = product.price;
      document.getElementById("edit_rating").value = product.rating;

      await fetchCategories(product.categoryID); // ensure it's pre-selected

      if (product.image) {
        imagePreviewWrapper.style.backgroundImage = `url('/assets/media/products/${product.image}')`;
      }
    } catch (err) {
      console.error("Failed to fetch product", err);
    }
  };

  const handleImagePreview = () => {
    imageInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          imagePreviewWrapper.style.backgroundImage = `url('${reader.result}')`;
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const productId = originalProductData.id;
    const title = form.querySelector("#edit_title").value.trim();
    const description = form.querySelector("#edit_description").value.trim();
    const price = form.querySelector("#edit_price").value.trim();
    const categoryID = form.querySelector("#edit_categoryID").value.trim();
    const rating = form.querySelector("#edit_rating").value.trim();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("categoryID", categoryID);
    formData.append("rating", rating);

    if (imageInput.files.length > 0) {
      // IF new Image uploaded
      const file = imageInput.files[0];
      const allowedTypes = ["image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        return Swal.fire({
          text: "Only JPG or JPEG images are allowed.",
          icon: "error",
        });
      }
      formData.append("image", file);
    } else {
      // If old one
      try {
        const imageUrl = `/assets/media/products/${originalProductData.image}`;
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], originalProductData.image, {
          type: blob.type,
        });
        formData.append("image", file);
      } catch (error) {
        return Swal.fire({
          text: "Failed to fetch original image.",
          icon: "error",
        });
      }
    }

    Swal.fire({
      text: "Are you sure you want to update this product?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "No, cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/products/updateProduct/${productId}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });

          if (!res.ok) throw new Error("Update failed");

          Swal.fire({
            text: "Product updated successfully!",
            icon: "success",
          }).then(() => {
            window.location.href = "/admin/products";
          });
        } catch (error) {
          Swal.fire({
            text: "Error updating product.",
            icon: "error",
          });
        }
      }
    });
  };

  const init = async () => {
    const productId = getProductIdFromUrl();
    console.log(productId);
    if (!productId) {
      return Swal.fire({ text: "Invalid Product ID", icon: "error" });
    }
    await fetchProductData(productId);
    handleImagePreview();
    form.addEventListener("submit", submitForm);
  };

  init();
});
