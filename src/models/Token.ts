import mongoose, { Schema, Types } from "mongoose";

export interface IToken {
    token: string;
    user: Types.ObjectId;
    expireAt: Date;
}

const TokenSchema = new mongoose.Schema<IToken>({
    token: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    expireAt: {
        type: Date,
        default: Date.now(),
        expires: 600 // 600 segundos -> 10 minutos
    }
})

const Token = mongoose.model("Token", TokenSchema)

export default Token