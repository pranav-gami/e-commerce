"use strict";

var KTAppEcommerceCategories = (function () {
  var tableElement, dataTable;

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
            categoryId = btn.getAttribute("data-categoryId");

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

      data.data.forEach((category) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>
            <div class="form-check form-check-sm form-check-custom form-check-solid">
              <input class="form-check-input" type="checkbox" value="${
                category.id
              }" />
            </div>
          </td>
          <td>
            <div class="d-flex">
              <a href="#" class="symbol symbol-50px">
                <span class="symbol-label" style="background-image:url('${
                  category.categoryImage || ""
                }');"></span>
              </a>
              <div class="ms-5">
                <a href="#" class="text-gray-800 text-hover-primary fs-5 fw-bold mb-1"
                   data-kt-ecommerce-category-filter="category_name">${
                     category.categoryName
                   }</a>
                <div class="text-muted fs-7 fw-bold">${
                  category.categoryName
                } contains large number of products</div>
              </div>
            </div>
          </td>
          <td><div class="badge badge-light-success">Automated</div></td>
          <td class="text-end">
            <a href="#" class="btn btn-sm btn-light btn-active-light-primary"
               data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
              Actions
              <span class="svg-icon svg-icon-5 m-0">
                <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 9l7 7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </a>
            <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-125px py-4"
                 data-kt-menu="true">
              <div class="menu-item px-3">
                <a href="#" data-categoryId="${
                  category.id
                }" class="menu-link px-3">Edit</a>
              </div>
              <div class="menu-item px-3">
                <a href="#" data-categoryId="${
                  category.id
                }" class="menu-link px-3" data-kt-ecommerce-category-filter="delete_row">Delete</a>
              </div>
            </div>
          </td>
        `;
        dataTable.row.add(row).draw(false);
      });

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

document.addEventListener("click", async function (e) {
  const editBtn = e.target.closest(".menu-link.px-3");
  if (editBtn && editBtn.textContent.trim() === "Edit") {
    e.preventDefault();
    const categoryId = editBtn.getAttribute("data-categoryId");
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

      const category = result.data;
      document.getElementById("category_modal_title").textContent =
        "Edit Category";
      document.getElementById("category_id").value = category.id;
      document.getElementById("category_name").value = category.categoryName;

      const preview = document.getElementById("category_image_preview");
      preview.src = category.categoryImage || "";
      preview.style.display = category.categoryImage ? "block" : "none";

      new bootstrap.Modal(
        document.getElementById("kt_modal_add_category")
      ).show();
    } catch (error) {
      console.error("Error fetching category:", error);
      Swal.fire("Error", "Something went wrong!", "error");
    }
  }
});

document
  .getElementById("category_image")
  .addEventListener("change", function () {
    const preview = document.getElementById("category_image_preview");
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        preview.src = e.target.result;
        preview.style.display = "block";
      };
      reader.readAsDataURL(file);
    } else {
      preview.style.display = "none";
    }
  });

document
  .getElementById("add_category_form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const categoryId = formData.get("category_id");
    const isEdit = !!categoryId;
    const categoryName = formData.get("category_name").trim();
    const categoryImage = document.getElementById("category_image").files[0];

    if (!categoryName || (!isEdit && !categoryImage)) {
      return Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill in the category name and upload an image.",
      });
    }

    formData.set("category_name", categoryName);
    if (!categoryImage && !isEdit) formData.delete("category_image");

    const token = localStorage.getItem("token");
    const url = isEdit
      ? `api/category/updateCategory/${categoryId}`
      : "api/category/addCategory";
    const method = isEdit ? "PUT" : "POST";

    const confirmResult = await Swal.fire({
      title: isEdit ? "Update Category?" : "Add New Category?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Confirm",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-secondary",
      },
    });

    if (!confirmResult.isConfirmed) return;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire("Success", data.message, "success").then(() => {
          bootstrap.Modal.getInstance(
            document.getElementById("kt_modal_add_category")
          ).hide();
          form.reset();
          document.getElementById("category_image_preview").style.display =
            "none";
          KTAppEcommerceCategories.init();
        });
      } else {
        throw new Error(data.message || "Failed to save category");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire("Error", error.message || "Something went wrong!", "error");
    }
  });

document
  .querySelector(".card-toolbar .btn.btn-primary")
  ?.addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("category_modal_title").textContent ="Add Category";
    document.getElementById("add_category_form").reset();
    document.getElementById("category_id").value = "";
    document.getElementById("category_image_preview").style.display = "none";

    new bootstrap.Modal(
      document.getElementById("kt_modal_add_category")
    ).show();
  });
