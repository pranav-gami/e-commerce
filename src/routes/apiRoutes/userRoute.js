import { Router } from "express";
import {
  addUser,
  showAllUsers,
  showUserById,
  updateUser,
  deleteUser,
} from "../../controller/userController.js";
import {
  validateParamsID,
  validateUserData,
} from "../../validation/validation.js";
import { verifyToken } from "../../middleware/verifyAuth.js";
import { authorizeRole } from "../../middleware/authoriseRole.js";

const router = Router();

router.post("/addUser", validateUserData, addUser);
router.get("/getAllUsers", verifyToken, authorizeRole("ADMIN"), showAllUsers);
router.get(
  "/getUser/:id",
  validateParamsID,
  verifyToken,
  showUserById
);
router.put("/updateUser/:id", validateParamsID, validateUserData, updateUser);
router.delete("/deleteUser/:id", validateParamsID, deleteUser);

export default router;
