import express from "express";
import productRouter from "./src/routes/productRoute.js";
import categoryRouter from "./src/routes/categoryRoute.js";
import userRouter from "./src/routes/userRoute.js";

const app = express();
const port = 3000;
app.use(express.json());

app.use("/products", productRouter);
app.use("/category", categoryRouter);
app.use("/user", userRouter);

app.get("/health", (req, res) => {
    res.send("server is up and running...");
})

app.listen(port, () => { console.log(`Server is Running at:3000.`) });