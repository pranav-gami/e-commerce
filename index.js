import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import expressEjsLayouts from "express-ejs-layouts";
import cookieParser from "cookie-parser";

// IMPORTING ROUTES
import apiRouter from "./src/routes/apiRoutes.js";
import viewRouter from "./src/routes/viewRoutes.js";

const app = express();
app.use(cookieParser());
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

// SETTINGUP EJS TEMPLATES
app.set("view engine", "ejs");
app.use(expressEjsLayouts);

// SETTING MAIN LAYOUT FOR EJS TEMPLATES
app.set("layout", "layouts/main");
app.set("views", path.join(__dirname, "src", "views"));
app.use(express.json());

// API AND VIEWS ROUTES
app.use("/api", apiRouter);
app.use("/", viewRouter);

app.get("/health", (req, res) => {
  res.send("server is up and running...");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is Running at:3000.`);
});
