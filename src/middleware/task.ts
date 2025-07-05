import { HydratedDocument } from "mongoose";
import Task, { ITask } from "../models/Task";
import { NextFunction, Request, Response } from "express";

// para reescribir la interfaz Request de express
declare global {
    namespace Express {
        interface Request {
            task: HydratedDocument<ITask>
        }
    }
}

export async function taskExist(req: Request, res: Response, next: NextFunction) {
    try {

        const { taskId } = req.params

        const task = await Task.findById(taskId)

        if (!task) {
            return res.status(404).json({
                errors: [{
                    msg: "Tarea no encontrada"
                }]
            })
        }

        req.task = task

        next()

    } catch (error) {
        res.status(500).json({
            error: "Hubo un error"
        })
    }
}

export function taskBelongsToProject(req: Request, res: Response, next: NextFunction) {

    const { task, project } = req

    if (!task.project.equals(project.id)) {
        return res.status(400).json({
            errors: [
                {
                    msg: "La tarea no pertenece al proyecto"
                }
            ]
        })
    }

    next()
}
