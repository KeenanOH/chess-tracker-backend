import mongoose from "mongoose"

export interface ISchool {
    _id: mongoose.Types.ObjectId,
    name: string,
}

const schoolSchema = new mongoose.Schema<ISchool>({
    name: { type: String, required: true }
}, { versionKey: false });

export const School = mongoose.model<ISchool>("schools", schoolSchema)
