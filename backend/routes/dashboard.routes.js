import express from "express"
import {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
  getRecentTransactions
} from "../controllers/dashboard.controller.js"
import { protect } from "../middlewares/auth.middleware.js"
import { restrictTo } from "../middlewares/role.middleware.js"

const router = express.Router()

router.get(
  "/summary",
  protect,
  restrictTo("admin", "analyst", "viewer"),
  getSummary
)

router.get(
  "/categories",
  protect,
  restrictTo("admin", "analyst", "viewer"),
  getCategoryBreakdown
)

router.get(
  "/trends",
  protect,
  restrictTo("admin", "analyst", "viewer"),
  getMonthlyTrends
)

router.get(
  "/recent",
  protect,
  restrictTo("admin", "analyst", "viewer"),
  getRecentTransactions
)

export default router