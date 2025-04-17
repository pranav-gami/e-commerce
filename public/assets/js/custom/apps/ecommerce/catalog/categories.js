"use strict";

var KTAppEcommerceCategories = (function () {
  let tableElement, dataTable;

  const handleDeleteRows = () => {
    tableElement
      .querySelectorAll('[data-kt-ecommerce-category-filter="delete_row"]')
      .forEach((btn) => {
        btn.addEventListener("click", async function (event) {
          event.preventDefault();
          const row = event.target.closest("tr"),
            name = row.querySelector(
              '[data-kt-ecommerce-category-filter="category_name"]'
            ).innerText,
            categoryId = btn.getAttribute("data-categoryid");

          if (!categoryId) return;

          const confirm = await Swal.fire({
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
          });

          if (confirm.isConfirmed) {
            try {
              const token = localStorage.getItem("token");
              const response = await fetch(
                `api/category/deleteCategory/${categoryId}`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              const result = await response.json();

              if (result.success) {
                Swal.fire({
                  text: `You have deleted ${name}!`,
                  icon: "success",
                  buttonsStyling: false,
                  confirmButtonText: "Ok, got it!",
                  customClass: { confirmButton: "btn fw-bold btn-primary" },
                }).then(() => {
                  dataTable.row($(row)).remove().draw();
                });
              } else {
                throw new Error(result.message || "Delete failed");
              }
            } catch (error) {
              console.error("Delete error:", error);
              Swal.fire(
                "Error",
                error.message || "Failed to delete category",
                "error"
              );
            }
          } else {
            Swal.fire({
              text: `${name} was not deleted.`,
              icon: "info",
              buttonsStyling: false,
              confirmButtonText: "Ok, got it!",
              customClass: { confirmButton: "btn fw-bold btn-primary" },
            });
          }
        });
      });
  };

  const getProductCount = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`api/products/getProductByCategoryId/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      return data.data;
    } catch (err) {
      return "0";
    }
  };

  const loadCategories = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("api/category/getAllCategories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      const tbody = tableElement.querySelector("tbody");
      tbody.innerHTML = "";

      for (const category of data.data) {
        const productCount = await getProductCount(category.id);
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>
            <div class="form-check form-check-sm form-check-custom form-check-solid">
              <input class="form-check-input" type="checkbox" value="${category.id}" />
            </div>
          </td>
          <td>
            <div class="d-flex">
              <a href="#" class="symbol symbol-50px">
                <span class="symbol-label" style="background-image: url(assets/media/products/${category.image}); background-size: cover;"></span>
              </a>
              <div class="ms-5">
                <span class="text-gray-800 text-hover-primary fs-5 fw-bold mb-1" data-kt-ecommerce-category-filter="category_name">${category.categoryName}</span>
                <div class="text-muted fs-7 fw-bold">${category.categoryName} contains large number of products</div>
              </div>
            </div>
          </td>
          <td><div class="badge badge-light-success">${productCount}</div></td>
          <td class="text-end">
            <a href="#" class="btn btn-sm btn-light btn-active-light-primary"
               data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">Actions
              <span class="svg-icon svg-icon-5 m-0">...</span>
            </a>
            <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-125px py-4"
                 data-kt-menu="true">
              <div class="menu-item px-3">
                <a href="#" class="menu-link px-3 edit-category-btn" data-categoryid="${category.id}">Edit</a>
              </div>
              <div class="menu-item px-3">
                <a href="#" class="menu-link px-3" data-kt-ecommerce-category-filter="delete_row" data-categoryid="${category.id}">Delete</a>
              </div>
            </div>
          </td>
        `;

        dataTable.row.add(row).draw(false);
      }

      KTMenu.createInstances();
      handleDeleteRows();
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  return {
    init: function () {
      tableElement = document.querySelector("#kt_ecommerce_category_table");
      if (!tableElement) return;

      if ($.fn.dataTable.isDataTable(tableElement)) {
        dataTable.clear().destroy();
      }

      dataTable = $(tableElement).DataTable({
        info: false,
        order: [],
        pageLength: 10,
        columnDefs: [
          { orderable: false, targets: 0 },
          { orderable: false, targets: 3 },
        ],
      });

      const searchInput = document.querySelector(
        '[data-kt-ecommerce-category-filter="search"]'
      );
      if (searchInput) {
        searchInput.addEventListener("keyup", (e) => {
          dataTable.search(e.target.value).draw();
        });
      }

      loadCategories();

      dataTable.on("draw", function () {
        handleDeleteRows();
      });
    },
  };
})();

KTUtil.onDOMContentLoaded(function () {
  KTAppEcommerceCategories.init();
});

let originalCategoryData = null;

// Edit modal logic
document.addEventListener("click", async function (e) {
  const editBtn = e.target.closest(".edit-category-btn");
  if (editBtn) {
    e.preventDefault();
    const categoryId = editBtn.getAttribute("data-categoryid");
    if (!categoryId) return;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`api/category/getCategory/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (!result.success) {
        return Swal.fire("Error", "Failed to load category details", "error");
      }

      originalCategoryData = result.data;
      document.getElementById("category_modal_title").textContent =
        "Edit Category";
      document.getElementById("category_id").value = originalCategoryData.id;
      document.getElementById("category_name").value =
        originalCategoryData.categoryName;

      const preview = document.getElementById("category_image_preview");
      preview.src = `assets/media/products/${originalCategoryData.image}`;
      preview.style.display = "block";

      new bootstrap.Modal(
        document.getElementById("kt_modal_add_category")
      ).show();
    } catch (error) {
      console.error("Error fetching category:", error);
      Swal.fire("Error", "Something went wrong!", "error");
    }
  }
});

// Edit Submit Handler (Updated Like Product Logic)
document
  .getElementById("category_submit_btn")
  .addEventListener("click", async function (e) {
    e.preventDefault();

    const categoryID = originalCategoryData.id;
    const categoryName = document.getElementById("category_name").value.trim();
    const imageInput = document.getElementById("category_image");

    const formData = new FormData();
    formData.append(
      "categoryName",
      categoryName || originalCategoryData.categoryName
    );

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
        const imageUrl = `assets/media/products/${originalCategoryData.image}`;
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], originalCategoryData.image, {
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
      const response = await fetch(
        `api/category/updateCategory/${categoryID}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      Swal.fire({
        text: "Category updated successfully!",
        icon: "success",
        confirmButtonText: "Ok, reload page",
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      Swal.fire({
        text: error.message || "Error updating category.",
        icon: "error",
      });
    }
  });
