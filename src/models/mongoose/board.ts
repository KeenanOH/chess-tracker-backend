import mongoose from "mongoose"
import {ISchool} from "./school";

interface IBoard {
    match: { type: mongoose.Types.ObjectId, ref: "matches" },
    rank: number,
    homePlayer: string,
    awayPlayer: string,
    result: string // home, away, or draw
}

export interface PopulatedBoard {
    match: { _id: string, homeSchool: ISchool, awaySchool: ISchool, date: Date },
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
}, { versionKey: false })

export const Board = mongoose.model<IBoard>("boards", boardSchema)
