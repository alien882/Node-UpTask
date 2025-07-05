import mongoose, { Schema, Types } from 'mongoose';
import Task from './Task';
import Note from './Note';

export interface IProject {
    projectName: string;
    clientName: string;
    description: string;
    tasks: Types.ObjectId[];
    manager: Types.ObjectId;
    team: Types.ObjectId[];
}

const ProjectSchema = new mongoose.Schema<IProject>({
    projectName: {
        type: String,
        required: true,
        trim: true
    },
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    tasks: [
        {
            type: Schema.Types.ObjectId,
            ref: "Task"
        }
    ],
    manager: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    team: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ]
}, { timestamps: true })

ProjectSchema.pre("deleteOne", { document: true, query: false }, async function () {

    const tasks = await Task.find({ project: this.id })
    tasks.forEach(async task => await Note.deleteMany({ task: task.id }))

    await Task.deleteMany({ project: this.id })
})


const Project = mongoose.model("Project", ProjectSchema)

export default Project