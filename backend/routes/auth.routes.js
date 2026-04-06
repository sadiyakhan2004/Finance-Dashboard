import express from "express"
import { login } from "../controllers/auth.controller.js"
import { loginValidation } from "../validations/user.validation.js"

const router = express.Router()

router.post("/login", loginValidation, login)

export default router