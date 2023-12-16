import express from "express"

import { auth } from "../middlewares/auth"
import { Board } from "../models/mongoose/board"
import { IMatch } from "../models/mongoose/match"

export const boardRouter = express.Router()
    .use(auth)


boardRouter.get("/boards", async (req, res) => {
    const { matchId } = req.query
    if (!matchId) return res.status(400).json({ message: "Missing parameter: `matchId`" })

    const boards = await Board.find({ match: matchId })

    return res.status(200).json(boards.map((board) => {
        return {
            id: board.id,
            rank: board.rank,
            homePlayer: board.homePlayer,
            awayPlayer: board.awayPlayer,
            result: board.result
        }
    }))
})

boardRouter.put("/board/:boardId", async (req, res) => {
    if (!req.currentUser) return res.status(401)

    const { boardId } = req.params
    if (!boardId) return res.status(400).json({ message: "Missing parameters" })

    const { homePlayer, awayPlayer, result } = req.body

    if (!homePlayer || !awayPlayer || !result)
        return res.status(400).json({ message: "Missing parameters" })
    else if (result != "home" && result != "away" && result != "draw")
        return res.status(400).json({ message: "`result` must be home, away, or draw" })

    let board = await Board.findOne({ _id: boardId })
        .populate<{ match: IMatch }>("match")

    if (!board) return res.status(409).json({ message: "Board does not exist" })

    const isHomeSchool = req.currentUser.schoolId == board.match.homeSchool.toString()
    const isAwaySchool = req.currentUser.schoolId == board.match.awaySchool.toString()
    const isParticipant = isHomeSchool || isAwaySchool
    if (!isParticipant || !req.currentUser.isAdmin) return res.status(401)

    board = await Board.findByIdAndUpdate(boardId, {homePlayer, awayPlayer, result})
    if (!board) return res.status(409).json({ message: "Board does not exist" })

    return res.status(200).json(
        { id: board.id, homePlayer, awayPlayer, result }
    )
})
