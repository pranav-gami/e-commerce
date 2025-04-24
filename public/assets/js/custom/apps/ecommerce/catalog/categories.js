"use strict";

var KTAppEcommerceCategories = (function () {
  let tableElement, dataTable;

  // ✅ Delegated delete handler
  const handleDeleteRows = () => {
    tableElement.addEventListener("click", async (event) => {
      const btn = event.target.closest(
        '[data-kt-ecommerce-category-filter="delete_row"]'
      );
      if (!btn) return;

      event.preventDefault();
      const row = btn.closest("tr");
      const name = row.querySelector(
        '[data-kt-ecommerce-category-filter="category_name"]'
      ).innerText;
      const categoryId = btn.getAttribute("data-categoryid");

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
              dataTable.row(row).remove().draw();
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
  };

  // ✅ Product count helper
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

  // ✅ Load categories
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
                <span class="symbol-label" style="background-image: url(assets/media/categories/${category.image}); background-size: cover;"></span>
              </a>
              <div class="ms-5">
                <span class="text-gray-800 text-hover-primary fs-5 fw-bold mb-1" data-kt-ecommerce-category-filter="category_name">${category.categoryName}</span>
                <div class="text-muted fs-7 fw-bold">${category.categoryName} contains large number of products</div>
              </div>
            </div>
          </td>
          <td class="text-center">
            <div class="badge badge-light-success">${productCount}</div>
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
                <a href="/admin/editcategory/${category.id}" class="menu-link px-3 edit-category-btn" data-categoryid="${category.id}">Edit</a>
              </div>
              <div class="menu-item px-3">
                <a href="#" class="menu-link px-3" data-kt-ecommerce-category-filter="delete_row" data-categoryid="${category.id}">Delete</a>
              </div>
            </div>
          </td>
        `;

        dataTable.row.add(row);
      }

      dataTable.draw(); // draw the table to apply rows
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

      // 🔁 Reinitialize menus on page change (fix for issue)
      $(tableElement).on("draw.dt", function () {
        setTimeout(() => {
          KTMenu.init();
          KTMenu.createInstances();
        }, 50);
      });

      // Search input handler
      const searchInput = document.querySelector(
        '[data-kt-ecommerce-user-filter="search"]'
      );
      if (searchInput) {
        searchInput.addEventListener("keyup", (e) => {
          dataTable.column(1).search(e.target.value).draw();
        });
      }

      handleDeleteRows();
      loadCategories();
    },
  };
})();

KTUtil.onDOMContentLoaded(function () {
  KTAppEcommerceCategories.init();
});
