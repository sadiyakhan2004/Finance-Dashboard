import express from "express"
import {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} from "../controllers/user.controller.js"
import { protect } from "../middlewares/auth.middleware.js"
import { restrictTo } from "../middlewares/role.middleware.js"

import {
  createUserValidation,
  updateUserValidation
} from "../validations/user.validation.js"

const router = express.Router()

router.post("/", protect, restrictTo("admin"), createUserValidation, createUser)
router.get("/", protect, restrictTo("admin"), getAllUsers)
router.get("/:id", protect, restrictTo("admin"), getUserById)
router.put("/:id", protect, restrictTo("admin"), updateUserValidation, updateUser)
router.delete("/:id", protect, restrictTo("admin"), deleteUser)

export default router