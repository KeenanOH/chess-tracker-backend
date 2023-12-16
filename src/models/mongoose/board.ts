import mongoose from "mongoose"

interface IBoard {
    match: { type: mongoose.Types.ObjectId, ref: "matches" },
    rank: number,
    homePlayer: string,
    awayPlayer: string,
    result: string // home, away, or draw
}

const boardSchema = new mongoose.Schema<IBoard>({
    match: { type: mongoose.Types.ObjectId, ref: "matches" },
    rank: { type: Number, required: true },
    homePlayer: { type: String, required: true },
    awayPlayer: { type: String, required: true },
    result: { type: String, required: true }
})

export const Board = mongoose.model<IBoard>("boards", boardSchema)
