import { Router } from "express";
import {
  addUser,
  showAllUsers,
  showUserById,
  updateUser,
  deleteUser,
  updateUserStatus,
  updateUserAddress,
  updatePassword,
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
router.get("/getUser/:id", validateParamsID, verifyToken, showUserById);
router.put("/updateUser/:id", validateParamsID, validateUserData, updateUser);
router.put("/updatePassword/:id", validateParamsID, updatePassword);
router.put("/updateStatus/:id", validateParamsID, updateUserStatus);
router.put("/updateAddress/:id", validateParamsID, updateUserAddress);
router.delete("/deleteUser/:id", verifyToken, validateParamsID, deleteUser);

export default router;
