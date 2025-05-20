import express, { Router } from "express";

import productRouter from "./apiRoutes/productRoute.js";
import categoryRouter from "./apiRoutes/categoryRoute.js";
import subcategoryRouter from "./apiRoutes/subCategoryRoutes.js";
import userRouter from "./apiRoutes/userRoute.js";
import cartRouter from "./apiRoutes/cartRoutes.js";
import authRouter from "./apiRoutes/authRoutes.js";
import cartProductRouter from "./apiRoutes/cartProductsRoutes.js";
import orderRouter from "./apiRoutes/orderRoutes.js";
import stripeRouter from "./apiRoutes/stripePaymentsRoutes.js";
import paymentRouter from "./apiRoutes/paymentRoutes.js";
import orderItemRouter from "./apiRoutes/orderItemsRoutes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/products", productRouter);
router.use("/category", categoryRouter);
router.use("/subcategory", subcategoryRouter);
router.use("/cart", cartRouter);
router.use("/cartProducts", cartProductRouter);
router.use("/order", orderRouter);
router.use("/stripepayment", stripeRouter);
router.use("/payment", paymentRouter);
router.use("/orderitem", orderItemRouter);

export default router;
