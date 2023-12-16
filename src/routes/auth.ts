import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import { User } from "../models/mongoose/user"
import { jwtSecret } from "../env"

export const authRouter = express.Router()

authRouter.post("/login", async function (req, res) {
    if (!jwtSecret) return res.sendStatus(500).json({ message: "Error with environment variables." })

    const { username, password } = req.body
    if (!username || !password) return res.status(400).json({ message: "Missing parameters" })

    let user = await User.findOne({username})
    if (!user) return res.status(401).json({ message: "Invalid username" })
    if (!(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: "Invalid password" })

    return res.status(200).json({
        "token": jwt.sign({ subject: user._id, isAdmin: user.isAdmin, schoolId: user.school }, jwtSecret)
    })
})
