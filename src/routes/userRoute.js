import { Router } from "express";
import { addUser, showUsers, showUserById, updateUser, deleteUser } from "../controller/userController.js";

const router = Router();

router.post("/addUser", addUser);
router.get("/getUsers", showUsers);
router.get("/getUser/:id", showUserById);
router.put("/updateUser/:id", updateUser);
router.delete("/deleteUser/:id", deleteUser);

export default router;