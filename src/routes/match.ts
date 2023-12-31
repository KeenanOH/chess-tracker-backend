import express from "express"

import { auth, isAdmin } from "../middlewares/auth"
import { ISchool, School } from "../models/mongoose/school"
import { Match } from "../models/mongoose/match"
import { Board } from "../models/mongoose/board"

export const matchRouter = express.Router()
    .use(auth)

matchRouter.get("/matches/:matchId", async (req, res) => {
    const { matchId } = req.params
    if (!matchId) return res.status(400).json({ message: "Missing parameters" })

    const match = await Match.findOne({ _id: matchId })
        .populate<{ homeSchool: ISchool, awaySchool: ISchool }>(["homeSchool", "awaySchool"])

    if (!match) return res.status(409).json({ message: "Match does not exist" })

    return res.json(match)
})

matchRouter.get("/matches", async (req, res) => {
    const { all } = req.query
    const schoolId = req.currentUser?.schoolId

    if (!schoolId) return res.status(400)

    let matches: any[]

    if (all != "true") {
        const homeMatches = await Match.find({ homeSchool: schoolId })
            .populate<{ homeSchool: ISchool, awaySchool: ISchool }>(["homeSchool", "awaySchool"])

        const awayMatches = await Match.find({ awaySchool: schoolId })
            .populate<{ homeSchool: ISchool, awaySchool: ISchool }>(["homeSchool", "awaySchool"])


        matches = homeMatches.concat(awayMatches)
    } else {
        matches = await Match.find()
            .populate<{ homeSchool: ISchool, awaySchool: ISchool }>(["homeSchool", "awaySchool"])
    }

    return res.json(matches)
})

matchRouter.post("/matches", isAdmin, async (req, res) => {
    let { homeSchool, awaySchool, date } = req.body
    date = new Date(date)
    if (!homeSchool || !awaySchool || !date) return res.status(400).json({ message: "Missing parameters" })

    const schoolsDoNotExist = !(await School.findOne({ _id: homeSchool })) || !(await School.findOne({ _id: awaySchool }))
    if (schoolsDoNotExist) return res.status(409).json({ message: "Invalid school" })

    const match = await Match.create({homeSchool, awaySchool, date})

    for (let i = 1; i <= 8; i++) {
        await Board.create({ match: match._id, rank: i, homePlayer: " ", awayPlayer: " ", result: " " })
    }

    return res.json(match)
})

matchRouter.delete("/matches/:matchId", isAdmin, async (req, res) => {
    const { matchId } = req.params
    if (!matchId) return res.status(400).json({ message: "Missing parameters" })

    await Board.deleteMany({ match: matchId })
    await Match.findByIdAndDelete(matchId)

    return res.json({ message: "Success" })
})
