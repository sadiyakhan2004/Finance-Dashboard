import express from "express"
import cors from "cors"

import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import transactionRoutes from "./routes/transaction.routes.js"
import dashboardRoutes from "./routes/dashboard.routes.js"


const app = express()

app.use(express.json())
app.use(cors())

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/transactions", transactionRoutes)
app.use("/api/dashboard", dashboardRoutes)

app.get("/", (req, res) => {
  res.json({ message: "Finance Dashboard API is running" })
})

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" })
})

export default app