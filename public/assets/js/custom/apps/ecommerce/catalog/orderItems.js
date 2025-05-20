"use strict";

var KTAppEcommerceOrderItems = (function () {
  let tableElement;
  let dataTable;
  let allOrders = [];

  const searchInput = document.querySelector(
    '[data-kt-orderitem-filter="search"]'
  );

  const formatDate = (isoDateStr) => {
    const date = new Date(isoDateStr);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const renderOrderItemRow = (orderItem) => {
    const isPending = orderItem.status == "PENDING" ? true : false;
    const isActiveBadgeClass =
      orderItem.status == "PENDING"
        ? "badge-light-danger"
        : orderItem.status == "SHIPPED"
        ? "badge-light-warning"
        : "badge-light-success";

    return `
      <tr>
        <td>
          <div class="d-flex align-items-center">
            <a href="#" class="symbol symbol-50px">
              <span class="symbol-label" style="background-image:url('/assets/media/products/${
                orderItem.image || "default.jpg"
              }')"></span>
            </a>
            <div class="ms-5">
              <span class="text-gray-800 fs-5 fw-bold text-truncate d-inline-block" style="max-width:160px">
                ${orderItem.title || "N/A"}
              </span>
            </div>
          </div>
        </td>
        <td class="text-end pe-0">₹ ${orderItem.price || 0}</td>
        <td class="text-end pe-0">${orderItem.quantity}</td>
        <td class="text-end pe-0"><div class="badge ${isActiveBadgeClass} fw-bold">${
      orderItem.status
    }</div></td>
        <td class="text-end pe-0">${formatDate(orderItem.createdAt)}</td>
        <td class="text-end">
          <a href="#" class="btn btn-sm btn-light btn-active-light-primary" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
            Actions
            <span class="svg-icon svg-icon-5 m-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M11.4343 12.7344L7.25 8.55005C6.83579 8.13583 6.16421 8.13584 5.75 8.55005C5.33579 
                8.96426 5.33579 9.63583 5.75 10.05L11.2929 15.5929C11.6834 15.9835 12.3166 15.9835 
                12.7071 15.5929L18.25 10.05C18.6642 9.63584 18.6642 8.96426 18.25 8.55005C17.8358 
                8.13584 17.1642 8.13584 16.75 8.55005L12.5657 12.7344C12.2533 13.0468 11.7467 
                13.0468 11.4343 12.7344Z" fill="currentColor"/>
              </svg>
            </span>
          </a>
          <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-150px py-4" data-kt-menu="true">
            ${
              isPending
                ? `<div class="menu-item px-3">
                    <a href="#" class="menu-link px-3" data-kt-orderitem-action="mark-shipped" data-id="${orderItem.id}">Mark as Shipped</a>
                </div>
                <div class="menu-item px-3">
                    <a href="#" class="menu-link px-3" data-kt-orderitem-action="mark-delivered" data-orderId="${orderItem.orderId}" data-id="${orderItem.id}">Mark as Delivered</a>
                </div>
                `
                : ``
            }
            <div class="menu-item px-3">
              <a href="#" class="menu-link px-3" data-kt-orderitem-action="delete" data-id="${
                orderItem.id
              }">Delete</a>
            </div>
          </div>
        </td>
      </tr>
    `;
  };

  const handleStatusChange = () => {
    tableElement
      .querySelectorAll(
        '[data-kt-orderitem-action="mark-shipped"], [data-kt-orderitem-action="mark-delivered"]'
      )
      .forEach((btn) => {
        btn.addEventListener("click", async function (event) {
          event.preventDefault();
          const id = btn.getAttribute("data-id");
          const action = btn.getAttribute("data-kt-orderitem-action");

          const newStatus = action === "mark-shipped" ? "SHIPPED" : "DELIVERED";
          const confirmText =
            newStatus === "SHIPPED"
              ? "Are you sure you want to mark this item as Shipped?"
              : "Are you sure you want to mark this item as Delivered?";

          Swal.fire({
            text: confirmText,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, confirm!",
            cancelButtonText: "No, cancel",
            buttonsStyling: false,
            customClass: {
              confirmButton: "btn fw-bold btn-primary",
              cancelButton: "btn fw-bold btn-active-light-primary",
            },
          }).then(async (result) => {
            if (result.value) {
              try {
                const response = await fetch(`/api/orderitem/updatestatus`, {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    itemId: parseInt(id),
                    status: newStatus,
                  }),
                });

                if (newStatus == "DELIVERED") {
                  const orderId = btn.getAttribute("data-orderId");
                  const res = await fetch(
                    `/api/payment/getbyorder/${parseInt(orderId)}`
                  );
                  const result = await res.json();
                  const payment = result.data;
                  console.log(payment);
                  if (payment.paymentMethod == "COD") {
                    const response = await fetch(`/api/payment/updatestatus`, {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        id: parseInt(id),
                        status: "PAID",
                      }),
                    });
                  }
                }
                const result = await response.json();

                if (response.ok) {
                  Swal.fire({
                    text: `Order item status updated to ${newStatus}`,
                    icon: "success",
                    confirmButtonText: "Ok, got it!",
                    buttonsStyling: false,
                    timer: 1000,
                    customClass: {
                      confirmButton: "btn fw-bold btn-primary",
                    },
                  }).then(() => {
                    loadOrderItems();
                  });
                } else {
                  throw new Error(result.message || "Failed to update status.");
                }
              } catch (err) {
                console.error("Error updating status:", err);
                Swal.fire({
                  text: "There was an error updating the status. Please try again.",
                  icon: "error",
                  confirmButtonText: "Ok",
                  buttonsStyling: false,
                  customClass: {
                    confirmButton: "btn fw-bold btn-danger",
                  },
                });
              }
            }
          });
        });
      });
  };

  const handleDeleteRows = () => {
    tableElement
      .querySelectorAll('[data-kt-orderitem-action="delete"]')
      .forEach((btn) => {
        btn.addEventListener("click", function (event) {
          event.preventDefault();
          const row = event.target.closest("tr");
          const id = btn.getAttribute("data-id");

          Swal.fire({
            text: "Are you sure you want to delete this order item?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete!",
            cancelButtonText: "No, cancel",
            buttonsStyling: false,
            customClass: {
              confirmButton: "btn fw-bold btn-danger",
              cancelButton: "btn fw-bold btn-active-light-primary",
            },
          }).then(async function (result) {
            if (result.value) {
              await fetch(`/api/orderitem/delete/${id}`, { method: "DELETE" });

              Swal.fire({
                text: "Order item has been deleted!",
                icon: "success",
                confirmButtonText: "Ok, got it!",
                buttonsStyling: false,
                customClass: { confirmButton: "btn fw-bold btn-primary" },
              }).then(() => {
                dataTable.row($(row)).remove().draw();
              });
            }
          });
        });
      });
  };

  const handlePriceFilter = () => {
    const $select = $("#pricefilter");
    if (!$select.length) return;

    $select.on("change", function () {
      const selectedValue = this.value;

      let sortedData = [...allOrders];

      if (selectedValue === "lowtohigh") {
        sortedData.sort((a, b) => a.price - b.price);
      } else if (selectedValue === "hightohigh") {
        sortedData.sort((a, b) => b.price - a.price);
      }
      renderTable(selectedValue === "all" ? allOrders : sortedData);
    });
  };

  const renderTable = (orders) => {
    if ($.fn.DataTable.isDataTable(tableElement)) {
      $(tableElement).DataTable().clear().destroy();
    }

    const tbody = tableElement.querySelector("tbody");
    tbody.innerHTML = orders.map(renderOrderItemRow).join("");

    dataTable = $(tableElement).DataTable({
      info: false,
      order: [],
      pageLength: 10,
      columnDefs: [
        { orderable: false, targets: 0 },
        { orderable: false, targets: -1 },
      ],
    });

    if (searchInput && !searchInput.dataset.bound) {
      searchInput.addEventListener("input", function (event) {
        dataTable.search(event.target.value).draw();
      });
      searchInput.dataset.bound = "true"; // Prevent re-binding
    }

    // Bind delete buttons and menu on draw
    dataTable.on("draw", () => {
      handleDeleteRows();
      handleStatusChange();
      KTMenu.createInstances();
    });

    // Initial bindings
    handleDeleteRows();
    handleStatusChange();
    KTMenu.createInstances();
  };

  const loadOrderItems = async () => {
    try {
      const res = await fetch("/api/orderitem/get");
      const result = await res.json();
      allOrders = result.data || [];
      renderTable(allOrders);
    } catch (err) {
      console.error("Error loading order items:", err);
    }
  };

  return {
    init: function () {
      tableElement = document.querySelector("#kt_ecommerce_order_table");
      if (!tableElement) return;
      loadOrderItems();
      handlePriceFilter();
    },
  };
})();

KTUtil.onDOMContentLoaded(function () {
  KTAppEcommerceOrderItems.init();
});
