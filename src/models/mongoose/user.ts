import mongoose from "mongoose"

interface IUser {
    username: string,
    password: string,
    school: { type: mongoose.Types.ObjectId, ref: "schools" },
    isAdmin: boolean
}

const userSchema = new mongoose.Schema<IUser>({
    username: { type: String, required: true },
    password: { type: String, required: true },
    school: { type: mongoose.Types.ObjectId, ref: "schools", required: true },
    isAdmin: { type: Boolean, default: false }
});

export const User = mongoose.model<IUser>("users", userSchema)
