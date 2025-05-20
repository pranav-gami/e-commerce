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
          const response = await fetch(
            `api/category/deleteCategory/${categoryId}`,
            { method: "DELETE" }
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

  // Load categories
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
            <div class="text-muted fs-7 fw-bold">${productCount}</div>
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
                <a href="" class="menu-link px-3 add-subcategory-btn" data-categoryid="${category.id}">Subcategories</a>
              </div>
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

  // SUBCATEGORY MANAGEMENTS
  const subcategoryHandlers = async () => {
    let currentCategoryId = null;
    let subcategories = [];
    const modal = new bootstrap.Modal(
      document.getElementById("manageSubcategoriesModal")
    );
    const subcategoryTableBody = document.getElementById(
      "subcategoryTableBody"
    );
    const addBtn = document.getElementById("addSubcategoryForm");
    const newSubNameInput = document.getElementById("newSubName");

    // Event Delegation: Handle click on all future subcategory buttons
    document.body.addEventListener("click", async (e) => {
      const btn = e.target.closest(".add-subcategory-btn");
      if (!btn) return;
      e.preventDefault();
      currentCategoryId = btn.getAttribute("data-categoryid");
      await loadSubcategories(currentCategoryId);
      modal.show();
    });

    // Load subcategories from API
    async function loadSubcategories(categoryId) {
      try {
        const res = await fetch(
          `/api/subcategory/getSubcategories/${categoryId}`
        );
        const data = await res.json();
        subcategories = data.data || [];
        renderSubcategories();
      } catch (err) {
        console.error("Error loading subcategories", err);
        Swal.fire("Error", err.message || "Failed to get subcategory", "error");
      }
    }

    // Render subcategories of that Category
    function renderSubcategories() {
      subcategoryTableBody.innerHTML = "";

      if (subcategories.length === 0) {
        subcategoryTableBody.innerHTML = `<tr><td colspan="3" class="text-center">No subcategories found.</td></tr>`;
        return;
      }

      subcategories.forEach((sub, index) => {
        const row = document.createElement("tr");
        row.classList.add("align-middle;");
        row.innerHTML = `
          <td class="align-middle text-center" style="width: 50px;">${
            index + 1
          }</td>
          <td class="align-middle" style="min-width: 300px;">
            <input type="text" class="form-control form-control-sm" value="${
              sub.name
            }" data-id="${sub.id}" />
          </td>
          <td class="align-middle text-center" style="width: 160px;">
            <div class="d-flex justify-content-center gap-2">
              <button class="btn btn-primary btn-sm me-1 update-subcategory-btn" data-id="${
                sub.id
              }">Edit</button>
              <button class="btn btn-danger btn-sm delete-subcategory-btn" data-id="${
                sub.id
              }">Delete</button>
            </div>
          </td>
        `;
        subcategoryTableBody.appendChild(row);
      });
    }

    // Add new  Subcategory Handler
    addBtn.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = newSubNameInput.value.trim();
      try {
        const res = await fetch("/api/subcategory/addsubcategory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, categoryId: currentCategoryId }),
        });
        const result = await res.json();
        if (result.success) {
          subcategories.push(result.data);
          newSubNameInput.value = "";
          Swal.fire({
            text: `Subcategory ${name} successfully added!!`,
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: { confirmButton: "btn fw-bold btn-primary" },
          });
          renderSubcategories();
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        Swal.fire("Error", err.message, "error");
      }
    });

    //Edit & Delete Handler for Subcategories
    subcategoryTableBody.addEventListener("click", async (e) => {
      const editBtn = e.target.closest(".update-subcategory-btn");
      const deleteBtn = e.target.closest(".delete-subcategory-btn");
      if (editBtn) {
        const id = editBtn.getAttribute("data-id");
        const input = subcategoryTableBody.querySelector(
          `input[data-id="${id}"]`
        );
        const newName = input.value.trim();
        try {
          const exists = subcategories.find((sub) => sub.name == newName);
          if (exists) {
            Swal.fire({
              text: `Subcategory ${newName} is already Exists!`,
              icon: "info",
              buttonsStyling: false,
              confirmButtonText: "Ok,got it!",
              customClass: {
                confirmButton: "btn fw-bold btn-primary",
              },
            });
          } else {
            const res = await fetch(
              `/api/subcategory/updateSubcategory/${id}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: newName,
                  categoryId: currentCategoryId,
                }),
              }
            );
            const result = await res.json();
            if (!result.success) {
              throw new Error(result.message);
            } else {
              subcategories = subcategories.filter(
                (s) => s.id !== parseInt(id)
              );
              subcategories.push(result.data);
              renderSubcategories();
              Swal.fire({
                text: `Updated successfully added!!`,
                icon: "success",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: { confirmButton: "btn fw-bold btn-primary" },
              });
            }
          }
        } catch (err) {
          console.error(err);
          Swal.fire("Error", err.message, "error");
        }
      }

      if (deleteBtn) {
        const id = deleteBtn.getAttribute("data-id");
        const confirm = await Swal.fire({
          text: `Are you sure you want to delete?`,
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
            const res = await fetch(`/api/subcategory/deleteSubategory/${id}`, {
              method: "DELETE",
            });
            const result = await res.json();
            if (result.success) {
              subcategories = subcategories.filter(
                (s) => s.id !== parseInt(id)
              );
              renderSubcategories();
              Swal.fire({
                text: `Deleted Successfully!`,
                icon: "success",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: { confirmButton: "btn fw-bold btn-primary" },
              });
            } else {
              Swal.fire("Error", "Failed to delete Subcategory!", "error");
            }
          } catch (err) {
            Swal.fire(
              "Error",
              err.message || "Failed to delete Subcategory",
              "error"
            );
          }
        } else {
          Swal.fire({
            text: `Not deleted!`,
            icon: "info",
            buttonsStyling: false,
            confirmButtonText: "Ok,got it!",
            customClass: {
              confirmButton: "btn fw-bold btn-primary",
            },
          });
        }
      }
    });
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

      // Reinitialize menus on page change (fix for issue)
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
      subcategoryHandlers();
    },
  };
})();

KTUtil.onDOMContentLoaded(function () {
  KTAppEcommerceCategories.init();
});
