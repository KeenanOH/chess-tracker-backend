import bcrypt from "bcrypt"
import express from "express"

import { User } from "../models/mongoose/user"
import { ISchool, School } from "../models/mongoose/school"
import { auth } from "../middlewares/auth"

export const userRouter = express.Router()

userRouter.get("/users", auth, async (req, res) => {
    if (!req.currentUser || !req.currentUser.isAdmin) return res.sendStatus(401)

    const users = await User.find()
        .populate<{ school: ISchool }>("school")

    return res.status(200).json(users.map((user) => {
        return `${user.username} - ${user.school.name}`
    }))
})

userRouter.post("/users", auth, async (req, res) => {
    if (!req.currentUser || !req.currentUser.isAdmin) return res.sendStatus(401)

    const {username, password, schoolId} = req.body
    if (!username || !password || !schoolId) return res.status(400).json({ message: "Missing parameters" })
    if (password.length < 6) return res.status(400).json({ message: "Password must be greater than or equal to 6 characters" })

    if (await User.findOne({username})) return res.status(409).json({ message: "Username already exists" })
    if (!(await School.findOne({_id: schoolId}))) return res.status(409).json({ message: "School does not exists" })

    const user = await User.create({ username, password: await bcrypt.hash(password, 10), school: schoolId })

    return res.json({ id: user.id, username, password, schoolId })
})

userRouter.delete("/users/:userId", auth, async (req, res) => {
    if (!req.currentUser || !req.currentUser.isAdmin) return res.sendStatus(401)

    const { userId } = req.params
    if (!userId) return res.status(400).json({ message: "Missing parameters" })

    await User.findByIdAndDelete(userId)

    return res.json({ message: "Success" })
})
