import express, { Router } from "express";

import productRouter from "./apiRoutes/productRoute.js";
import categoryRouter from "./apiRoutes/categoryRoute.js";
import subcategoryRouter from "./apiRoutes/subCategoryRoutes.js";
import userRouter from "./apiRoutes/userRoute.js";
import cartRouter from "./apiRoutes/cartRoutes.js";
import authRouter from "./apiRoutes/authRoutes.js";
import cartProductRouter from "./apiRoutes/cartProductsRoutes.js";
import orderRouter from "./apiRoutes/orderPaymentRoutes.js";
import paymentRouter from "./apiRoutes/paymentsRoutes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/products", productRouter);
router.use("/category", categoryRouter);
router.use("/subcategory", subcategoryRouter);
router.use("/cart", cartRouter);
router.use("/cartProducts", cartProductRouter);
router.use("/order", orderRouter);
router.use("/payment", paymentRouter);

export default router;
