"use strict";

var KTAppEcommerceProducts = (function () {
  let tableElement;
  let dataTable;

  function generateRatingStars(rating) {
    let starsHTML = "";
    for (let i = 0; i < 5; i++) {
      starsHTML += `
        <div class="rating-label ${i < rating ? "checked" : ""}">
          <span class="svg-icon svg-icon-2">
            <svg width="24" height="24" viewBox="0 0 24 24"
              fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.1359 4.48359C11.5216 3.82132 12.4784 3.82132 12.8641 4.48359L15.011 8.16962C15.1523 8.41222 15.3891 8.58425 15.6635 8.64367L19.8326 9.54646C20.5816 9.70867 20.8773 10.6186 20.3666 11.1901L17.5244 14.371C17.3374 14.5803 17.2469 14.8587 17.2752 15.138L17.7049 19.382C17.7821 20.1445 17.0081 20.7069 16.3067 20.3978L12.4032 18.6777C12.1463 18.5645 11.8537 18.5645 11.5968 18.6777L7.69326 20.3978C6.99192 20.7069 6.21789 20.1445 6.2951 19.382L6.7248 15.138C6.75308 14.8587 6.66264 14.5803 6.47558 14.371L3.63339 11.1901C3.12273 10.6186 3.41838 9.70867 4.16744 9.54646L8.3365 8.64367C8.61089 8.58425 8.84767 8.41222 8.98897 8.16962L11.1359 4.48359Z"
                fill="currentColor" />
            </svg>
          </span>
        </div>
      `;
    }
    return starsHTML;
  }

  const renderProductRow = (product) => {
    return `
      <tr>
        <td>
          <div class="form-check form-check-sm form-check-custom form-check-solid">
            <input class="form-check-input" type="checkbox" value="${
              product.id
            }" />
          </div>
        </td>
        <td>
          <div class="d-flex align-items-center">
            <a href="" class="symbol symbol-50px">
              <span class="symbol-label" style="background-image:url('assets/media/products/${
                product.image
              }')"></span>
            </a>
            <div class="ms-5">
              <a href="/product/edit/${
                product.id
              }" class="text-gray-800 text-hover-primary fs-5 fw-bold"
                 data-kt-ecommerce-product-filter="product_name">${
                   product.title
                 }</a>
            </div>
          </div>
        </td>
        <td class="text-end pe-0">
          <span class="fw-bold ms-3">${product.description}</span>
        </td>
        <td class="text-end pe-0">${product.price}</td>
        <td class="text-end pe-0 ms-5" data-order=${product.rating}>
            <div class="rating justify-content-end">
            ${generateRatingStars(product.rating)}
          </div>
        </td>
        <td class="text-center pe-0" data-category="${product.categoryID}">
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
              <a href="#" data-productid="${
                product.id
              }" class="menu-link px-3">Edit</a>
            </div>
            <div class="menu-item px-3">
              <a href="#" class="menu-link px-3" data-kt-ecommerce-product-filter="delete_row" data-id="${
                product.id
              }">Delete</a>
            </div>
          </div>
        </td>
      </tr>`;
  };

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

  const loadProducts = async () => {
    const tableBody = tableElement.querySelector("tbody");
    tableBody.innerHTML = `<tr><td colspan="6">Loading...</td></tr>`;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("api/products/getAllProducts", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      const products = result.data;

      const rows = products.map(renderProductRow).join("");
      tableBody.innerHTML = rows;

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

      const searchInput = document.querySelector(
        '[data-kt-ecommerce-product-filter="search"]'
      );
      if (searchInput) {
        searchInput.addEventListener("keyup", function (event) {
          dataTable.search(event.target.value).draw();
        });
      }

      dataTable.on("draw", () => {
        handleDeleteRows();
        KTMenu.createInstances();
      });

      handleDeleteRows();
      KTMenu.createInstances();
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

const ProductEditModal = (function () {
  const modalElement = document.getElementById("kt_modal_edit_product");
  const modal = new bootstrap.Modal(modalElement);
  const form = document.getElementById("edit_product_form");
  const imagePreview = document.getElementById("edit_image_preview");

  let originalProductData = {};

  const init = () => {
    // Event delegation: catch clicks on edit buttons regardless of DataTable redraw
    document.body.addEventListener("click", async (e) => {
      const target = e.target.closest(".menu-link[data-productid]");
      if (target) {
        e.preventDefault();
        const productId = target.getAttribute("data-productid");
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
      form.querySelector("#edit_rating").value = product.rating || "";

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
    const productId = originalProductData.id;
    const title = form.querySelector("#edit_title").value.trim();
    const description = form.querySelector("#edit_description").value.trim();
    const price = form.querySelector("#edit_price").value.trim();
    const categoryID = form.querySelector("#edit_categoryID").value.trim();
    const imageInput = form.querySelector("#edit_image");
    const rating = form.querySelector("#edit_rating").value.trim();

    const formData = new FormData();

    formData.append("title", title || originalProductData.title);
    formData.append(
      "description",
      description || originalProductData.description
    );
    formData.append("price", price || originalProductData.price);
    formData.append("categoryID", categoryID || originalProductData.categoryID);
    formData.append("rating", rating || originalProductData.rating);

    if (imageInput.files.length > 0) {
      const selectedFile = imageInput.files[0];
      const allowedTypes = ["image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(selectedFile.type)) {
        return Swal.fire({
          text: "Only JPG or JPEG images are allowed.",
          icon: "error",
        });
      }
      formData.append("image", selectedFile);
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
        return Swal.fire({
          text: "Failed to fetch original image.",
          icon: "error",
        });
      }
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/products/updateProduct/${productId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error("Update failed");

      Swal.fire({
        text: "Product updated successfully!",
        icon: "success",
        confirmButtonText: "Ok, reload page",
      }).then(() => {
        modal.hide();
        window.location.reload();
      });
    } catch (error) {
      Swal.fire({
        text: "Error updating product.",
        icon: "error",
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
