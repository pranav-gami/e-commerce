"use strict";

var KTAppUserList = (function () {
  let tableElement;
  let dataTable;
  let allUsers = [];

  const renderUserRow = (user) => {
    if (user.role != "ADMIN") {
      const nameInitial = user.username.charAt(0).toUpperCase();
      const isActive = user.isActive ? "YES" : "NO";
      const isActiveBadgeClass = user.isActive
        ? "badge-light-success"
        : "badge-light-danger";

      return `
      <tr>
        <td>
          <div class="form-check form-check-sm form-check-custom form-check-solid">
            <input class="form-check-input" type="checkbox" value="${
              user.id
            }" />
          </div>
        </td>
        <td class="d-flex align-items-center">
          <div class="symbol symbol-circle symbol-50px overflow-hidden me-3">
            <a href="/admin/users/${user.id}">
              <div class="symbol-label fs-3 bg-light-danger text-danger">${nameInitial}</div>
            </a>
          </div>
          <div class="d-flex flex-column">
            <a href="/admin/users/${
              user.id
            }" class="text-gray-800 text-hover-primary mb-1">${
        user.username
      }</a>
            <span>${user.email}</span>
          </div>
        </td>
        <td class="text-end">${user.role}</td>
        <td class="text-end">
          <div class="text-muted fs-7 fw-bold">${user.email || "N/A"}</div>
        </td>
        <td class="text-end">
          <div class="badge ${isActiveBadgeClass} fw-bold">${isActive}</div>
        </td>
        <td class="text-end">
          <a href="#" class="btn btn-light btn-active-light-primary btn-sm" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
            Actions
            <span class="svg-icon svg-icon-5 m-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M11.4343 12.7344L7.25 8.55C6.83579 8.13583 6.16421 8.13584 5.75 8.55C5.33579 8.96426 5.33579 9.63583 5.75 10.05L11.2929 15.5929C11.6834 15.9835 12.3166 15.9835 12.7071 15.5929L18.25 10.05C18.6642 9.63584 18.6642 8.96426 18.25 8.55C17.8358 8.13584 17.1642 8.13584 16.75 8.55L12.5657 12.7344C12.2533 13.0468 11.7467 13.0468 11.4343 12.7344Z" fill="currentColor"/>
              </svg>
            </span>
          </a>
          <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-125px py-4" data-kt-menu="true">
            <div class="menu-item px-3">
              <a href="/admin/users/${user.id}" class="menu-link px-3">View</a>
            </div>
            <div class="menu-item px-3">
              <a href="#" class="menu-link px-3 delete-user-btn" data-user-id="${
                user.id
              }" data-user-name="${user.username}">Delete</a>
            </div>
          </div>
        </td>
      </tr>`;
    }
  };

  const renderTable = (users) => {
    const tbody = tableElement.querySelector("tbody");
    tbody.innerHTML = users.map(renderUserRow).join("");

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

    dataTable.on("draw", () => {
      handleDeleteButtons();
      KTMenu.createInstances();
    });

    handleDeleteButtons();
    KTMenu.createInstances();
  };

  const loadUsers = async () => {
    try {
      const res = await fetch("/api/user/getAllUsers");
      const users = await res.json();
      allUsers = users.data;
      renderTable(allUsers);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  const handleDeleteButtons = () => {
    document.querySelectorAll(".delete-user-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const userId = btn.getAttribute("data-user-id");
        const userName = btn.getAttribute("data-user-name");
        const row = btn.closest("tr");

        Swal.fire({
          text: `Are you sure you want to delete ${userName}?`,
          icon: "warning",
          showCancelButton: true,
          buttonsStyling: false,
          confirmButtonText: "Yes, delete!",
          cancelButtonText: "Cancel",
          customClass: {
            confirmButton: "btn fw-bold btn-danger",
            cancelButton: "btn fw-bold btn-active-light-primary",
          },
        }).then((result) => {
          if (result.value) {
            fetch(`/api/user/delete/${userId}`, {
              method: "DELETE",
            }).then((res) => {
              console.log(res);
              if (res.ok) {
                Swal.fire({
                  text: `${userName} has been deleted!`,
                  icon: "success",
                  confirmButtonText: "OK",
                  buttonsStyling: false,
                  customClass: {
                    confirmButton: "btn fw-bold btn-primary",
                  },
                }).then(() => {
                  dataTable.row($(row)).remove().draw();
                });
              } else {
                Swal.fire({
                  text: `Failed to delete ${userName}`,
                  icon: "error",
                  confirmButtonText: "OK",
                  buttonsStyling: false,
                  customClass: {
                    confirmButton: "btn fw-bold btn-primary",
                  },
                });
              }
            });
          }
        });
      });
    });
  };

  const searchInput = document.querySelector(
    '[data-kt-ecommerce-user-filter="search"]'
  );
  if (searchInput) {
    searchInput.addEventListener("keyup", (e) => {
      dataTable.column(1).search(e.target.value).draw();
    });
  }

  return {
    init: function () {
      tableElement = document.querySelector("#kt_table_users");
      if (!tableElement) return;
      loadUsers();
    },
  };
})();

KTUtil.onDOMContentLoaded(function () {
  KTAppUserList.init();
});
