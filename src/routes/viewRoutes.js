import express, { Router } from "express";
import { verifyToken } from "../middleware/verifyAuth.js";
import { authorizeRole } from "../middleware/authoriseRole.js";

const router = Router();

// ROUTES FOR DIFFRENT PAGES
router.get("/login", (req, res) => {
  res.render("pages/signIn", { layout: false });
});

router.get("/signup", (req, res) => {
  res.render("pages/signUp", { layout: false });
});

router.get("/", (req, res) => {
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

router.get("/products", (req, res) => {
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
});

router.get("/categories", (req, res) => {
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
});

router.get("/profile", (req, res) => {
  res.render("pages/profile", {
    styles: `
	    <link href="assets/plugins/custom/datatables/datatables.bundle.css" rel="stylesheet" type="text/css" />`,
    scripts: `
	    <script src="assets/js/custom/pages/user-profile/general.js"></script>`,
    vendor: `
        <script src="assets/plugins/custom/datatables/datatables.bundle.js"></script>`,
  });
});

export default router;
