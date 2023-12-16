import express from "express"

import { auth, isAdmin } from "../middlewares/auth"
import { ISchool, School } from "../models/mongoose/school"
import { Match } from "../models/mongoose/match"
import { Board } from "../models/mongoose/board"

export const matchRouter = express.Router()
    .use(auth)

matchRouter.get("/match/:matchId", async (req, res) => {
    const { matchId } = req.params
    if (!matchId) return res.status(400).json({ message: "Missing parameters" })

    const match = await Match.findOne({ _id: matchId })
        .populate<{ homeSchool: ISchool }>("homeSchool")
        .populate<{ awaySchool: ISchool }>("awaySchool")

    if (!match) return res.status(409).json({ message: "Match does not exist" })

    return res.json({
        id: match._id,
        homeSchool: { id: match.homeSchool._id, name: match.homeSchool.name },
        awaySchool: { id: match.awaySchool._id, name: match.awaySchool.name },
        date: match.date
    })
})

matchRouter.get("/matches", async (req, res) => {
    const { all } = req.query
    const schoolId = req.currentUser?.schoolId

    if (!schoolId) return res.status(400)

    let matches: any[]

    if (all != "true") {
        const homeMatches = await Match.find({ homeSchool: schoolId })
            .populate<{ homeSchool: ISchool }>("homeSchool")
            .populate<{ awaySchool: ISchool }>("awaySchool")
        const awayMatches = await Match.find({ awaySchool: schoolId })
            .populate<{ homeSchool: ISchool }>("homeSchool")
            .populate<{ awaySchool: ISchool }>("awaySchool")

        matches = homeMatches.concat(awayMatches)
    } else {
        matches = await Match.find()
            .populate<{ homeSchool: ISchool }>("homeSchool")
            .populate<{ awaySchool: ISchool }>("awaySchool")
    }

    return res.status(200).json((matches.map((match) => {
        return {
            id: match._id,
            homeSchool: { id: match.homeSchool._id, name: match.homeSchool.name },
            awaySchool: { id: match.awaySchool._id, name: match.awaySchool.name },
            date: match.date
        }
    })))
})

matchRouter.post("/match", isAdmin, async (req, res) => {
    let { homeSchool, awaySchool, date } = req.body
    date = new Date(date)
    if (!homeSchool || !awaySchool || !date) return res.status(400).json({ message: "Missing parameters" })

    const schoolsDoNotExist = !(await School.findOne({ _id: homeSchool })) || !(await School.findOne({ _id: awaySchool }))
    if (schoolsDoNotExist) return res.status(409).json({ message: "Invalid school" })

    const match = await Match.create({homeSchool, awaySchool, date})

    for (let i = 1; i <= 8; i++) {
        await Board.create({ match: match._id, rank: i, homePlayer: " ", awayPlayer: " ", result: " " })
    }

    return res.status(200).json({ id: match._id, homeSchool, awaySchool, date })
})

matchRouter.delete("/match/:matchId", isAdmin, async (req, res) => {
    const { matchId } = req.params
    if (!matchId) return res.status(400).json({ message: "Missing parameters" })

    await Board.deleteMany({ match: matchId })
    await Match.findByIdAndDelete(matchId)

    return res.status(200).json({ message: "Success" })
})
