import express from "express"

import { auth, isAdmin } from "../middlewares/auth"
import { School } from "../models/mongoose/school"

export const schoolRouter = express.Router()
    .use(auth)
    .use(isAdmin)

schoolRouter.get("/schools", async (_, res) => {
    const schools = await School.find()

    return res.json(schools.map((school) => {
        return { id: school._id, name: school.name }
    }))
})

schoolRouter.post("/school", async (req, res) => {
    const { name } = req.body
    if (!name) return res.status(400).json({ message: "Missing parameters" })
    if (await School.findOne({name})) return res.status(409).json({message: "School already exists"})

    const school = await School.create({name})

    return res.status(200).json({id: school.id, name: school.name})
})

schoolRouter.delete("/school/:schoolId", async function (req, res) {
    const {schoolId} = req.params
    if (!schoolId) return res.status(400).json({message: "Missing parameters"})

    await School.findByIdAndDelete(schoolId)

    return res.status(204)
})
