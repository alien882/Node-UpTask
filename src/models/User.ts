import mongoose from "mongoose";

export interface IUser {
    email: string;
    password: string;
    name: string;
    confirmed: boolean
}

const UserSchema = new mongoose.Schema<IUser>({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    confirmed: {
        type: Boolean,
        default: false
    }
})

const User = mongoose.model("User", UserSchema);

export default User