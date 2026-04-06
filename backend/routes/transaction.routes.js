import express from "express"
import {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction
} from "../controllers/transaction.controller.js"
import { protect } from "../middlewares/auth.middleware.js"
import { restrictTo } from "../middlewares/role.middleware.js"
import {
  createTransactionValidation,
  updateTransactionValidation
} from "../validations/transaction.validation.js"

const router = express.Router()

router.post(
    "/",
    protect,
    restrictTo("admin", "analyst"),
    createTransactionValidation,
    createTransaction
)

router.get(
    "/",
    protect,
    restrictTo("admin", "analyst", "viewer"),
    getAllTransactions
)

router.get(
    "/:id",
    protect,
    restrictTo("admin", "analyst", "viewer"),
    getTransactionById
)

router.put(
    "/:id",
    protect,
    restrictTo("admin", "analyst"),
    updateTransactionValidation,
    updateTransaction
)

router.delete(
    "/:id",
    protect,
    restrictTo("admin"),
    deleteTransaction
)

export default router