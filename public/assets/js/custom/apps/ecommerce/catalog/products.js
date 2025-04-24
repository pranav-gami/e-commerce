"use strict";

var KTAppEcommerceProducts = (function () {
  let tableElement;
  let dataTable;
  let allProducts = [];

  // GENERATE RATINGS STARS
  function generateRatingStars(rating) {
    let starsHTML = "";

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.2;
    const totalStars = 5;

    const starSVG = (fillColor) => `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="${fillColor}" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.1359 4.48359C11.5216 3.82132 12.4784 3.82132 12.8641 4.48359L15.011 8.16962C15.1523 8.41222 15.3891 8.58425 15.6635 8.64367L19.8326 9.54646C20.5816 9.70867 20.8773 10.6186 20.3666 11.1901L17.5244 14.371C17.3374 14.5803 17.2469 14.8587 17.2752 15.138L17.7049 19.382C17.7821 20.1445 17.0081 20.7069 16.3067 20.3978L12.4032 18.6777C12.1463 18.5645 11.8537 18.5645 11.5968 18.6777L7.69326 20.3978C6.99192 20.7069 6.21789 20.1445 6.2951 19.382L6.7248 15.138C6.75308 14.8587 6.66264 14.5803 6.47558 14.371L3.63339 11.1901C3.12273 10.6186 3.41838 9.70867 4.16744 9.54646L8.3365 8.64367C8.61089 8.58425 8.84767 8.41222 8.98897 8.16962L11.1359 4.48359Z"/>
      </svg>
    `;

    // Full Stars
    for (let i = 0; i < fullStars; i++) {
      starsHTML += `
        <div class="rating-label checked">
          <span class="svg-icon svg-icon-2 text-warning">
            ${starSVG("currentColor")}
          </span>
        </div>`;
    }

    // Half Star (visually aligned)
    if (hasHalfStar) {
      starsHTML += `
        <div class="rating-label checked half" style="position: relative; width: 24px; height: 24px">
          <span class="svg-icon svg-icon-2 text-muted" style="position: absolute; top: 15%; left: 0;">
            ${starSVG("#ccc")}
          </span>
          <span class="svg-icon svg-icon-2 text-warning" style="position: absolute; top: 15%; left: 0; clip-path: inset(0 50% 0 0);">
            ${starSVG("currentColor")}
          </span>
        </div>`;
    }

    // Empty Stars
    const remainingStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < remainingStars; i++) {
      starsHTML += `
        <div class="rating-label">
          <span class="svg-icon svg-icon-2 text-muted">
            ${starSVG("#ccc")}
          </span>
        </div>`;
    }

    return starsHTML;
  }

  // RENDER PRODUCTS
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
            <a href="admin/editproduct/${
              product.id
            }" class="symbol symbol-50px">
              <span class="symbol-label" style="background-image:url('assets/media/products/${
                product.image
              }')"></span>
            </a>
            <div class="ms-5">
              <a href="admin/editproduct/${
                product.id
              }" class="text-gray-800 text-hover-primary fs-5 fw-bold text-truncate d-inline-block"  style="max-width:150px"
                 data-kt-ecommerce-product-filter="product_name">${
                   product.title
                 }</a>
            </div>
          </div>
        </td>
        <td class="text-end pe-0">
          <span class="fw-bold ms-3 text-truncate d-inline-block" style="max-width:180px">${
            product.description
          }</span>
        </td>
        <td class="text-end pe-0">${product.price}₹</td>
        <td class="text-end pe-0 ms-5" data-order=${product.rating}>
          <div class="rating justify-content-end">
            ${generateRatingStars(product.rating)}
          </div>
        </td>
        <td class="text-center pe-0" data-category="${product.categoryID}">
          <div class="badge badge-light-primary">${product.categoryID}</div>
        </td>
        <td class="text-end">
          <a href="" class="btn btn-sm btn-light btn-active-light-primary"
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
              <a href="admin/editproduct/${product.id}" data-productid="${
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

  // DELETE EVENT
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

  const handleCategoryFilter = () => {
    const $select = $("[data-kt-ecommerce-product-filter='category']");

    if (!$select.length) {
      console.error("Category select element not found!");
      return;
    }

    $select.on("change", function () {
      const selectedValue = this.value;

      if (selectedValue === "all") {
        dataTable.search("").columns().search("").draw();
      } else {
        dataTable
          .columns(5)
          .search("^" + parseInt(selectedValue) + "$", true, false)
          .draw();
      }

      const filteredData = dataTable
        .rows({ search: "applied" })
        .data()
        .toArray();
    });
  };

  const renderTable = (products) => {
    const tableBody = tableElement.querySelector("tbody");
    tableBody.innerHTML = products.map(renderProductRow).join("");

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
        dataTable.column(1).search(event.target.value).draw();
      });
    }

    dataTable.on("draw", () => {
      handleDeleteRows();
      KTMenu.createInstances();
    });

    handleDeleteRows();
    KTMenu.createInstances();
  };

  const loadProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("api/products/getAllProducts", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      allProducts = result.data;
      renderTable(allProducts);
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  };

  const loadCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/category/getAllCategories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      const select = document.querySelector(
        "[data-kt-ecommerce-product-filter='category']"
      );
      select.innerHTML = `<option value="all">All</option>`;
      result.data.forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.categoryName;
        select.appendChild(option);
      });
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  return {
    init: function () {
      tableElement = document.querySelector("#kt_ecommerce_products_table");
      if (!tableElement) return;
      loadProducts().then(() => {
        loadCategories();
        handleCategoryFilter();
      });
    },
  };
})();

KTUtil.onDOMContentLoaded(function () {
  KTAppEcommerceProducts.init();
});
