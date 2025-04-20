import express, { Router } from "express";
import { verifyToken } from "../middleware/verifyAuth.js";
import { authorizeRole } from "../middleware/authoriseRole.js";

const router = Router();

// ROUTES FOR DIFFRENT PAGES
router.get("/admin/login", (req, res) => {
  const errorType = req.query.error;
  let errorMessage = "";

  if (errorType === "login_required") {
    errorMessage = "You must be logged in to access that page.";
  } else if (errorType === "") {
    errorMessage = "Your session has expired. Please log in again.";
  }
  res.render("pages/signIn", { layout: false, errorMessage });
});

router.get("/signup", (req, res) => {
  res.render("pages/signUp", { layout: false });
});

router.get("/admin/dashboard", verifyToken, (req, res) => {
  res.render("index", {
    styles: `<link href="assets/plugins/custom/fullcalendar/fullcalendar.bundle.css" rel="stylesheet" type="text/css" />
            <link href="assets/plugins/custom/datatables/datatables.bundle.css" rel="stylesheet" type="text/css" />`,
    scripts: `
        <script src="assets/js/widgets.bundle.js"></script>
		    <script src="assets/js/custom/widgets.js"></script>
    `,
    vendor: `
        <script src="assets/plugins/custom/datatables/datatables.bundle.js"></script>
		    <script src="assets/plugins/custom/vis-timeline/vis-timeline.bundle.js"></script>
    `,
  });
});

router.get("/admin/users", verifyToken, authorizeRole("ADMIN"), (req, res) => {
  res.render("pages/userListing", {
    styles: `<link href="assets/plugins/custom/datatables/datatables.bundle.css" rel="stylesheet" type="text/css" />`,
    scripts: `
        <script src="assets/js/custom/apps/ecommerce/catalog/userlisting.js"></script>
        <script src="assets/js/widgets.bundle.js"></script>
        <script src="assets/js/custom/widgets.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    `,
    vendor: `
        <script src="assets/plugins/custom/datatables/datatables.bundle.js"></script>
    `,
  });
});

router.get(
  "/admin/users/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  (req, res) => {
    res.render("pages/userView", {
      userId: req.params.id,
      styles: `<link href="assets/plugins/custom/datatables/datatables.bundle.css" rel="stylesheet" type="text/css" />`,
      scripts: `
        <script src="assets/js/custom/apps/ecommerce/catalog/user-view.js"></script>
        <script src="assets/js/widgets.bundle.js"></script>
        <script src="assets/js/custom/widgets.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    `,
      vendor: `
        <script src="assets/plugins/custom/datatables/datatables.bundle.js"></script>
    `,
    });
  }
);

router.get(
  "/admin/products",
  verifyToken,
  authorizeRole("ADMIN"),
  (req, res) => {
    res.render("pages/products", {
      styles: `<link href="assets/plugins/custom/datatables/datatables.bundle.css" rel="stylesheet" type="text/css" />`,
      scripts: `
        <script src="assets/js/custom/apps/ecommerce/catalog/products.js"></script>
        <script src="assets/js/widgets.bundle.js"></script>
        <script src="assets/js/custom/widgets.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    `,
      vendor: `
        <script src="assets/plugins/custom/datatables/datatables.bundle.js"></script>
    `,
    });
  }
);

router.get(
  "/admin/categories",
  verifyToken,
  authorizeRole("ADMIN"),
  (req, res) => {
    res.render("pages/categories", {
      styles: `<link href="assets/plugins/custom/datatables/datatables.bundle.css" rel="stylesheet" type="text/css" />`,
      scripts: `
		<script src="assets/js/custom/apps/ecommerce/catalog/categories.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    `,
      vendor: `
        <script src="assets/plugins/custom/datatables/datatables.bundle.js"></script>
    `,
    });
  }
);

router.get("/admin/profile", verifyToken, (req, res) => {
  res.render("pages/profile", {
    styles: `
	    <link href="assets/plugins/custom/datatables/datatables.bundle.css" rel="stylesheet" type="text/css" />`,
    scripts: `
	    <script src="assets/js/custom/pages/user-profile/general.js"></script>`,
    vendor: `
        <script src="assets/plugins/custom/datatables/datatables.bundle.js"></script>`,
  });
});

router.get(
  "/admin/products/add",
  verifyToken,
  authorizeRole("ADMIN"),
  (req, res) => {
    res.render("pages/addProduct", {
      styles: `
	    <link href="assets/plugins/custom/datatables/datatables.bundle.css" rel="stylesheet" type="text/css" />`,
      scripts: `
      <script src="assets/js/custom/apps/ecommerce/catalog/save-product.js"></script>`,
      vendor: `
	    <script src="assets/plugins/custom/datatables/datatables.bundle.js"></script>`,
    });
  }
);

router.get(
  "/admin/categories/add",
  verifyToken,
  authorizeRole("ADMIN"),
  (req, res) => {
    res.render("pages/addCategory", {
      styles: `
	    <link href="/assets/plugins/custom/datatables/datatables.bundle.css" rel="stylesheet" type="text/css" />`,
      scripts: `
      <script src="/assets/js/custom/apps/ecommerce/catalog/save-category.js"></script>`,
      vendor: `
	    <script src="/assets/plugins/custom/datatables/datatables.bundle.js"></script>
	    <script src="/assets/plugins/custom/formrepeater/formrepeater.bundle.js"></script>`,
    });
  }
);

router.get(
  `/admin/editproduct/:id`,
  verifyToken,
  authorizeRole("ADMIN"),
  (req, res) => {
    res.render("pages/editProduct", {
      productId: req.params.id,
      styles: `
	    <link href="assets/plugins/custom/datatables/datatables.bundle.css" rel="stylesheet" type="text/css" />`,
      scripts: `
      <script src="assets/js/custom/apps/ecommerce/catalog/edit-product.js"></script>`,
      vendor: `
	    <script src="assets/plugins/custom/datatables/datatables.bundle.js"></script>
	    <script src="assets/plugins/custom/formrepeater/formrepeater.bundle.js"></script>`,
    });
  }
);

router.get(
  "/admin/editcategory/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  (req, res) => {
    res.render("pages/editCategory", {
      categoryId: req.params.id,
      styles: `
	    <link href="/assets/plugins/custom/datatables/datatables.bundle.css" rel="stylesheet" type="text/css" />`,
      scripts: `
      <script src="/assets/js/custom/apps/ecommerce/catalog/edit-category.js"></script>`,
      vendor: `
	    <script src="/assets/plugins/custom/datatables/datatables.bundle.js"></script>
	    <script src="/assets/plugins/custom/formrepeater/formrepeater.bundle.js"></script>`,
    });
  }
);

export default router;
