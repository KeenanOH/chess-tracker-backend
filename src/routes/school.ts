import express from "express"

import { auth, isAdmin } from "../middlewares/auth"
import { School } from "../models/mongoose/school"

export const schoolRouter = express.Router()
    .use(auth)
    .use(isAdmin)

schoolRouter.get("/schools", async (_, res) => {
    const schools = await School.find()

    return res.json(schools)
})

schoolRouter.post("/schools", async (req, res) => {
    const { name } = req.body
    if (!name) return res.status(400).json({ message: "Missing parameters" })
    if (await School.findOne({name})) return res.status(409).json({message: "School already exists"})

    const school = await School.create({name})

    return res.json(school)
})

schoolRouter.delete("/schools/:schoolId", async function (req, res) {
    const {schoolId} = req.params
    if (!schoolId) return res.status(400).json({message: "Missing parameters"})

    await School.findByIdAndDelete(schoolId)

    return res.status(204)
})
