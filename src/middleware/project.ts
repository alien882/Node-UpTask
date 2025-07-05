import { Request, Response, NextFunction } from "express";
import Project, { IProject } from "../models/Proyect";
import { HydratedDocument } from "mongoose";

// para reescribir la interfaz Request de express
declare global {
    namespace Express {
        interface Request {
            project: HydratedDocument<IProject>
        }
    }
}

export async function projectExist(req: Request, res: Response, next: NextFunction) {
    try {

        const { projectId } = req.params

        const project = await Project.findById(projectId)

        if (!project) {
            return res.status(404).json({
                errors: [{
                    msg: "Proyecto no encontrado"
                }]
            })
        }

        req.project = project

        next()

    } catch (error) {
        res.status(500).json({
            error: "Hubo un error"
        })
    }
}


export async function projectBelongsToManager(req: Request, res: Response, next: NextFunction) {

    const { project, user } = req

    if (!project.manager.equals(user.id)) {
        return res.status(400).json({
            errors: [
                {
                    msg: "Solo el manager puede realizar esta acción"
                }
            ]
        })
    }

    next()
}