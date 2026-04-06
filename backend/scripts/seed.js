import mongoose from "mongoose"
import dotenv from "dotenv"
import User from "../models/user.model.js"

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env') });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("MongoDB Connected")

    const existingAdmin = await User.findOne({ role: "admin" })

    if (existingAdmin) {
      console.log("Admin already exists")
      console.log(`Email: ${existingAdmin.email}`)
      process.exit(0)
    }

    const admin = await User.create({
      name: "Super Admin",
      email: "admin@techcorp.com",
      password: "admin123",
      role: "admin",
      status: "active"
    })

    console.log("Admin created successfully")
    console.log(`Name  : ${admin.name}`)
    console.log(`Email : ${admin.email}`)
    console.log(`Role  : ${admin.role}`)

    process.exit(0)

  } catch (error) {
    console.error("Error seeding admin", error)
    process.exit(1)
  }
}

seedAdmin()