import mongoose, { Schema, Types } from "mongoose"

export interface INote {
    content: string
    createdBy: Types.ObjectId
    task: Types.ObjectId
}


const NoteSchema = new mongoose.Schema<INote>({
    content: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    task: {
        type: Schema.Types.ObjectId,
        ref: "Task"
    }
}, { timestamps: true })


const Note = mongoose.model("Note", NoteSchema)

export default Note