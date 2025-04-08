import express from "express";
import productRouter from "./src/routes/productRoute.js";
import categoryRouter from "./src/routes/categoryRoute.js";
import userRouter from "./src/routes/userRoute.js";
import cartRouter from "./src/routes/cartRoutes.js";
import authRouter from "./src/routes/authRoutes.js";
import cartProductRouter from "./src/routes/cartProductsRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

//Defining Diffrent Routes 
app.use("/login", authRouter);
app.use("/products", productRouter);
app.use("/category", categoryRouter);
app.use("/user", userRouter);
app.use("/cart", cartRouter);
app.use("/cartProducts", cartProductRouter);

app.get("/health", (req, res) => {
    res.send("server is up and running...");
})

app.listen(process.env.PORT, () => { console.log(`Server is Running at:3000.`) });