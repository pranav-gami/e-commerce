"use strict";

var KTAppEcommerceProducts = (function () {
  let tableElement;
  let dataTable;

  // Render each row of product
  const renderProductRow = (product) => {
    return `
      <tr>
        <td>
          <div class="form-check form-check-sm form-check-custom form-check-solid">
            <input class="form-check-input" type="checkbox" value="${product.id}" />
          </div>
        </td>
        <td>
          <div class="d-flex align-items-center">
            <a href="" class="symbol symbol-50px">
              <span class="symbol-label" style="background-image:url('assets/media/products/${product.image}')"></span>
            </a>
            <div class="ms-5">
              <a href="/product/edit/${product.id}" class="text-gray-800 text-hover-primary fs-5 fw-bold"
                 data-kt-ecommerce-product-filter="product_name">${product.title}</a>
            </div>
          </div>
        </td>
        <td class="text-end pe-0">
          <span class="fw-bold ms-3">${product.description}</span>
        </td>
        <td class="text-end pe-0">${product.price}</td>
        <td class="text-end pe-0" data-category="${product.categoryID}">
          <div class="badge badge-light-primary">${product.categoryID}</div>
        </td>
        <td class="text-end">
          <a href="#" class="btn btn-sm btn-light btn-active-light-primary"
             data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">Actions
            <span class="svg-icon svg-icon-5 m-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                   xmlns="http://www.w3.org/2000/svg">
                <path d="M11.4343 12.7344L7.25 8.55005C6.83579 8.13583 6.16421 8.13584 5.75 8.55005C5.33579 
                8.96426 5.33579 9.63583 5.75 10.05L11.2929 15.5929C11.6834 15.9835 12.3166 15.9835 
                12.7071 15.5929L18.25 10.05C18.6642 9.63584 18.6642 8.96426 18.25 8.55005C17.8358 
                8.13584 17.1642 8.13584 16.75 8.55005L12.5657 12.7344C12.2533 13.0468 11.7467 
                13.0468 11.4343 12.7344Z" fill="currentColor"/>
              </svg>
            </span>
          </a>
          <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-125px py-4"
               data-kt-menu="true">
            <div class="menu-item px-3">
              <a href="" data-productId="${product.id}" class="menu-link px-3">Edit</a>
            </div>
            <div class="menu-item px-3">
              <a href="#" class="menu-link px-3" data-kt-ecommerce-product-filter="delete_row" data-id="${product.id}">Delete</a>
            </div>
          </div>
        </td>
      </tr>`;
  };

  // Handle delete row actions with confirmation
  const handleDeleteRows = () => {
    tableElement
      .querySelectorAll('[data-kt-ecommerce-product-filter="delete_row"]')
      .forEach((btn) => {
        btn.addEventListener("click", function (event) {
          event.preventDefault();
          const row = event.target.closest("tr");
          const name = row.querySelector(
            '[data-kt-ecommerce-product-filter="product_name"]'
          ).innerText;
          const id = btn.getAttribute("data-id");

          Swal.fire({
            text: `Are you sure you want to delete ${name}?`,
            icon: "warning",
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonText: "Yes, delete!",
            cancelButtonText: "No, cancel",
            customClass: {
              confirmButton: "btn fw-bold btn-danger",
              cancelButton: "btn fw-bold btn-active-light-primary",
            },
          }).then(async function (result) {
            if (result.value) {
              await fetch(`api/products/deleteProduct/${id}`, {
                method: "DELETE",
              });
              Swal.fire({
                text: `${name} has been deleted!`,
                icon: "success",
                confirmButtonText: "Ok, got it!",
                buttonsStyling: false,
                customClass: { confirmButton: "btn fw-bold btn-primary" },
              }).then(() => {
                dataTable.row($(row)).remove().draw();
              });
            } else if (result.dismiss === "cancel") {
              Swal.fire({
                text: `${name} was not deleted.`,
                icon: "error",
                confirmButtonText: "Ok, got it!",
                buttonsStyling: false,
                customClass: { confirmButton: "btn fw-bold btn-primary" },
              });
            }
          });
        });
      });
  };

  // Load products and render with DataTable
  const loadProducts = async () => {
    const tableBody = tableElement.querySelector("tbody");
    tableBody.innerHTML = `<tr><td colspan="6">Loading...</td></tr>`;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("api/products/getAllProducts", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ⬅️ Send token here
        },
      });

      const result = await res.json();
      const products = result.data;

      const rows = products.map(renderProductRow).join("");
      tableBody.innerHTML = rows;

      // Initialize or reinitialize DataTable
      if ($.fn.DataTable.isDataTable(tableElement)) {
        dataTable.destroy();
      }

      dataTable = $(tableElement).DataTable({
        info: false,
        order: [],
        pageLength: 10,
        columnDefs: [
          { orderable: false, targets: 0 },
          { orderable: false, targets: 5 },
        ],
      });

      // Handle search input
      const searchInput = document.querySelector(
        '[data-kt-ecommerce-product-filter="search"]'
      );
      if (searchInput) {
        searchInput.addEventListener("keyup", function (event) {
          dataTable.search(event.target.value).draw();
        });
      }

      // Handle delete buttons after redraw or pagination
      dataTable.on("draw", () => {
        handleDeleteRows();
      });

      // Reapply menu initialization
      KTMenu.createInstances();
      handleDeleteRows();
    } catch (err) {
      console.error("Failed to load products:", err);
      tableBody.innerHTML = `<tr><td colspan="6" class="text-danger text-center">Error loading products</td></tr>`;
    }
  };

  return {
    init: function () {
      tableElement = document.querySelector("#kt_ecommerce_products_table");
      if (!tableElement) return;
      loadProducts();
    },
  };
})();

KTUtil.onDOMContentLoaded(function () {
  KTAppEcommerceProducts.init();
});

// EDIT PRODUCT DATA
// const ProductEditModal = (function () {
//   const modalElement = document.getElementById("kt_modal_edit_product");
//   const modal = new bootstrap.Modal(modalElement);
//   const form = document.getElementById("edit_product_form");
//   const imagePreview = document.getElementById("edit_image_preview");

//   let originalProductData = {};

//   const init = () => {
//     document.body.addEventListener("click", async (e) => {
//       if (e.target.matches(".menu-link[data-productid]")) {
//         e.preventDefault();
//         const productId = e.target.getAttribute("data-productid");
//         await openModal(productId);
//       }
//     });

//     // Handle form submission
//     form.addEventListener("submit", async (e) => {
//       e.preventDefault();
//       const confirmUpdate = confirm(
//         "Are you sure you want to update this product?"
//       );
//       if (confirmUpdate) {
//         await submitForm();
//       }
//     });

//     // Handle live image preview when selecting a new file
//     const imageInput = form.querySelector("#edit_image");
//     imageInput.addEventListener("change", (e) => {
//       const file = e.target.files[0];
//       if (file) {
//         imagePreview.src = URL.createObjectURL(file);
//         imagePreview.alt = file.name;
//       }
//     });
//   };

//   // Open modal and populate form with product data
//   const openModal = async (productId) => {
//     try {
//       const response = await fetch(`api/products/getProduct/${productId}`, {
//         method: "GET",
//       });
//       if (!response.ok) throw new Error("Failed to fetch product data.");
//       const data = await response.json();
//       const product = data.data;

//       // Save original data to compare Later
//       originalProductData = { ...product };

//       // Populate form fields with product data
//       form.querySelector("#edit_product_id").value = product.id || "";
//       form.querySelector("#edit_title").value = product.title || "";
//       form.querySelector("#edit_description").value = product.description || "";
//       form.querySelector("#edit_price").value = product.price || "";
//       form.querySelector("#edit_categoryID").value = product.categoryID || "";

//       // Update image preview if image exists
//       if (product.image) {
//         imagePreview.src = `assets/media/products/${product.image}`;
//         imagePreview.alt = product.title || "Product Image";
//       } else {
//         imagePreview.src = "";
//         imagePreview.alt = "No Image Available";
//       }

//       modal.show();
//     } catch (error) {
//       console.error(error);
//       alert("Failed to retrieve product data.");
//     }
//   };

//   // Submit updated product data
//   const submitForm = async () => {
//     const productId = form.querySelector("#edit_product_id").value;
//     const title = form.querySelector("#edit_title").value.trim();
//     const description = form.querySelector("#edit_description").value.trim();
//     const price = form.querySelector("#edit_price").value.trim();
//     const categoryID = form.querySelector("#edit_categoryID").value.trim();
//     const imageInput = form.querySelector("#edit_image");

//     const formData = new FormData();

//     formData.append("title", title || originalProductData.title);
//     formData.append(
//       "description",
//       description || originalProductData.description
//     );
//     formData.append("price", price || originalProductData.price);
//     formData.append("categoryID", categoryID || originalProductData.categoryID);

//     if (imageInput.files && imageInput.files.length > 0) {
//       formData.append("image", imageInput.files[0]);
//     } else {
//       try {
//         // ✅ If no new image, fetch the old one and append it
//         const imageUrl = `assets/media/products/${originalProductData.image}`;
//         const response = await fetch(imageUrl);
//         const blob = await response.blob();

//         const file = new File([blob], originalProductData.image, {
//           type: blob.type,
//         });
//         formData.append("image", file);
//       } catch (error) {
//         console.error("Error fetching original image:", error);
//         alert("Failed to fetch the original image file.");
//         return;
//       }
//     }
//     console.log(formData);
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`api/products/updateProduct/${productId}`, {
//         method: "PUT",
//         body: formData,
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (!response.ok) throw new Error("Failed to update product.");
//       const updatedProduct = await response.json();
//       alert("Product updated successfully!");
//       window.location.reload();
//       modal.hide();
//     } catch (error) {
//       console.error(error);
//       alert("Error updating product.");
//     }
//   };

//   return {
//     init,
//   };
// })();

// EDIT PRODUCT DATA
const ProductEditModal = (function () {
  const modalElement = document.getElementById("kt_modal_edit_product");
  const modal = new bootstrap.Modal(modalElement);
  const form = document.getElementById("edit_product_form");
  const imagePreview = document.getElementById("edit_image_preview");

  let originalProductData = {};

  const init = () => {
    document.body.addEventListener("click", async (e) => {
      if (e.target.matches(".menu-link[data-productid]")) {
        e.preventDefault();
        const productId = e.target.getAttribute("data-productid");
        await openModal(productId);
      }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      Swal.fire({
        text: "Are you sure you want to update this product?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "No, cancel",
        customClass: {
          confirmButton: "btn fw-bold btn-primary",
          cancelButton: "btn fw-bold btn-active-light",
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          await submitForm();
        }
      });
    });

    const imageInput = form.querySelector("#edit_image");
    imageInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        imagePreview.src = URL.createObjectURL(file);
        imagePreview.alt = file.name;
      }
    });
  };

  const openModal = async (productId) => {
    try {
      const response = await fetch(`api/products/getProduct/${productId}`, {
        method: "GET",
      });
      if (!response.ok) throw new Error("Failed to fetch product data.");
      const data = await response.json();
      const product = data.data;

      originalProductData = { ...product };

      form.querySelector("#edit_product_id").value = product.id || "";
      form.querySelector("#edit_title").value = product.title || "";
      form.querySelector("#edit_description").value = product.description || "";
      form.querySelector("#edit_price").value = product.price || "";
      form.querySelector("#edit_categoryID").value = product.categoryID || "";

      if (product.image) {
        imagePreview.src = `assets/media/products/${product.image}`;
        imagePreview.alt = product.title || "Product Image";
      } else {
        imagePreview.src = "";
        imagePreview.alt = "No Image Available";
      }

      modal.show();
    } catch (error) {
      console.error(error);
      Swal.fire({
        text: "Failed to retrieve product data.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const submitForm = async () => {
    const productId = form.querySelector("#edit_product_id").value;
    const title = form.querySelector("#edit_title").value.trim();
    const description = form.querySelector("#edit_description").value.trim();
    const price = form.querySelector("#edit_price").value.trim();
    const categoryID = form.querySelector("#edit_categoryID").value.trim();
    const imageInput = form.querySelector("#edit_image");

    const formData = new FormData();

    formData.append("title", title || originalProductData.title);
    formData.append(
      "description",
      description || originalProductData.description
    );
    formData.append("price", price || originalProductData.price);
    formData.append("categoryID", categoryID || originalProductData.categoryID);

    if (imageInput.files && imageInput.files.length > 0) {
      formData.append("image", imageInput.files[0]);
    } else {
      try {
        const imageUrl = `assets/media/products/${originalProductData.image}`;
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        const file = new File([blob], originalProductData.image, {
          type: blob.type,
        });
        formData.append("image", file);
      } catch (error) {
        console.error("Error fetching original image:", error);
        Swal.fire({
          text: "Failed to fetch the original image file.",
          icon: "error",
          confirmButtonText: "Ok",
        });
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`api/products/updateProduct/${productId}`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to update product.");

      const updatedProduct = await response.json();

      Swal.fire({
        text: "Product updated successfully!",
        icon: "success",
        confirmButtonText: "Ok, reload page",
        customClass: {
          confirmButton: "btn fw-bold btn-primary",
        },
      }).then(() => {
        modal.hide();
        window.location.reload();
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        text: "Error updating product.",
        icon: "error",
        confirmButtonText: "Ok",
        customClass: {
          confirmButton: "btn fw-bold btn-primary",
        },
      });
    }
  };

  return {
    init,
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  ProductEditModal.init();
});
