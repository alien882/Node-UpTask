import mongoose, { Schema, Types } from "mongoose";
import Note from "./Note";

enum StatusTask {
    pending = "pending",
    onHold = "onHold",
    inProgress = "inProgress",
    underReview = "underReview",
    completed = "completed"
}

interface ChangedBy {
    user: Types.ObjectId
    status: StatusTask
}

export interface ITask {
    name: string
    description: string
    status: StatusTask
    project: Types.ObjectId
    changedBy: ChangedBy[]
    notes: Types.ObjectId[]
}

const TaskSchema = new mongoose.Schema<ITask>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: StatusTask,
        default: StatusTask.pending
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project"
    },
    changedBy: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
            status: {
                type: String,
                enum: StatusTask
            }
        }
    ],
    notes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Note"
        }
    ]
}, { timestamps: true })

// es un middleware de moongose
// se ejecuta antes del metodo deleteOne
// { document: true, query: false } -> para tener una referencia del documento
// y no de la consulta
TaskSchema.pre("deleteOne", { document: true, query: false }, async function () {
    await Note.deleteMany({ task: this.id })
})

const Task = mongoose.model("Task", TaskSchema)

export default Task