import express, { Router } from "express";
import { verifyToken } from "../middleware/verifyAuth.js";
import { authorizeRole } from "../middleware/authoriseRole.js";

const router = Router();

// ROUTES FOR DIFFRENT PAGES OF ADMIN
router.get("/admin/login", (req, res) => {
  const errorType = req.query.error;
  let errorMessage = "";

  if (errorType === "login_required") {
    errorMessage = "login_required";
  } else if (errorType === "only_admin") {
    errorMessage = "only_admin";
  }
  if (errorType === "only_user") {
    errorMessage = "only_user";
  }
  res.render("pages/signIn", { layout: false, errorMessage });
});

// SIGNUP PAGE ROUTE
router.get("/signup", (req, res) => {
  res.render("pages/signUp", { layout: false });
});

router.get(
  "/admin/dashboard",
  verifyToken,
  authorizeRole("ADMIN"),
  (req, res) => {
    res.render("index", {
      styles: `<link href="assets/plugins/custom/datatables/datatables.bundle.css" rel="stylesheet" type="text/css" />`,
      scripts: `
        <script src="assets/js/widgets.bundle.js"></script>
		    <script src="assets/js/custom/widgets.js"></script>
`,
      vendor: `
        <script src="assets/plugins/custom/datatables/datatables.bundle.js"></script>`,
    });
  }
);

router.get("/admin/users", verifyToken, authorizeRole("ADMIN"), (req, res) => {
  res.render("pages/admin/userListing", {
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
    res.render("pages/admin/userView", {
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
    res.render("pages/admin/products", {
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
    res.render("pages/admin/categories", {
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
  res.render("pages/admin/profile", {
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
    res.render("pages/admin/addProduct", {
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
    res.render("pages/admin/addCategory", {
      styles: `
	    <link href="/assets/plugins/custom/datatables/datatables.bundle.css" rel="stylesheet" type="text/css" />`,
      scripts: `
      <script src="/assets/js/custom/apps/ecommerce/catalog/save-category.js"></script>`,
      vendor: `
	    <script src="/assets/plugins/custom/datatables/datatables.bundle.js"></script>`,
    });
  }
);

router.get(
  `/admin/editproduct/:id`,
  verifyToken,
  authorizeRole("ADMIN"),
  (req, res) => {
    res.render("pages/admin/editProduct", {
      productId: req.params.id,
      styles: `
	    <link href="assets/plugins/custom/datatables/datatables.bundle.css" rel="stylesheet" type="text/css" />`,
      scripts: `
      <script src="assets/js/custom/apps/ecommerce/catalog/edit-product.js"></script>`,
      vendor: `
	    <script src="assets/plugins/custom/datatables/datatables.bundle.js"></script>`,
    });
  }
);

router.get(
  "/admin/editcategory/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  (req, res) => {
    res.render("pages/admin/editCategory", {
      categoryId: req.params.id,
      styles: `
	    <link href="/assets/plugins/custom/datatables/datatables.bundle.css" rel="stylesheet" type="text/css" />`,
      scripts: `
      <script src="/assets/js/custom/apps/ecommerce/catalog/edit-category.js"></script>`,
      vendor: `
	    <script src="/assets/plugins/custom/datatables/datatables.bundle.js"></script>`,
    });
  }
);

//ROUTES FOR USER

//USER LOGIN PAGE ROUTE
router.get("/user/login", (req, res) => {
  const errorType = req.query.error;
  let errorMessage = "";

  if (errorType === "login_required") {
    errorMessage = "Login Required!!";
  } else if (errorType === "only_admin") {
    errorMessage = "only_admin";
  }
  if (errorType === "only_user") {
    errorMessage = "only_user";
  }
  res.render("pages/signInUser", { layout: false, errorMessage });
});

// MAIN PAGE
router.get("/primestore", verifyToken, authorizeRole("USER"), (req, res) => {
  res.render("pages/users/ecommerce", {
    layout: "layouts/userLayout",
    scripts: `
    <script type="module" src="/assets/js/custom/apps/ecommerce/customers/userHome.js" defer></script>`,
  });
});

router.get(
  "/primestore/cart/:id",
  verifyToken,
  authorizeRole("USER"),
  (req, res) => {
    res.render("pages/users/userCart", {
      userId: req.params.id,
      layout: "layouts/userLayout",
      scripts: `
      <script type="module" src="/assets/js/custom/apps/ecommerce/customers/userCart.js" defer></script>`,
    });
  }
);

router.get(
  "/primestore/product/:id",
  verifyToken,
  authorizeRole("USER"),
  (req, res) => {
    res.render("pages/users/productView", {
      productId: req.params.id,
      layout: "layouts/userLayout",
      scripts: `<script type="module" src="/assets/js/custom/apps/ecommerce/customers/productView.js" defer></script>`,
    });
  }
);

router.get(
  "/primestore/category/:id",
  verifyToken,
  authorizeRole("USER"),
  (req, res) => {
    res.render("pages/users/categoryProducts", {
      categoryId: req.params.id,
      layout: "layouts/userLayout",
      scripts: `
      <script type="module" src="/assets/js/custom/apps/ecommerce/customers/categoryProducts.js" defer></script>`,
    });
  }
);

router.get(
  "/primestore/search",
  verifyToken,
  authorizeRole("USER"),
  (req, res) => {
    res.render("pages/users/searchProducts", {
      layout: "layouts/userLayout",
      
      scripts: `
      <script type="module" src="/assets/js/custom/apps/ecommerce/customers/searchProducts.js" defer></script>`,
    });
  }
);

export default router;
