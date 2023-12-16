import mongoose from "mongoose"

export interface IMatch {
    homeSchool: { type: mongoose.Types.ObjectId, ref: "schools" },
    awaySchool: { type: mongoose.Types.ObjectId, ref: "schools" },
    date: Date
}

const matchSchema = new mongoose.Schema<IMatch>({
    homeSchool: { type: mongoose.Types.ObjectId, ref: "schools", required: true },
    awaySchool: { type: mongoose.Types.ObjectId, ref: "schools", required: true },
    date: { type: Date, required: true }
})

export const Match = mongoose.model<IMatch>("matches", matchSchema)
