import { Router } from "express";
import { addUser, showAllUsers, showUserById, updateUser, deleteUser } from "../controller/userController.js";
import { validateParamsID, validateUserData } from "../validation/validation.js";

const router = Router();

router.post("/addUser", validateUserData, addUser);
router.get("/getAllUsers", showAllUsers);
router.get("/getUser/:id", validateParamsID, showUserById);
router.put("/updateUser/:id", validateParamsID, validateUserData, updateUser);
router.delete("/deleteUser/:id", validateParamsID, deleteUser);

export default router;