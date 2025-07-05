import { Request, Response } from "express";
import Project from "../models/Proyect";
import Task from "../models/Task";
import Note from "../models/Note";

class ProjectController {

    public static async createProject(req: Request, res: Response) {

        try {

            const { user } = req

            const project = new Project({
                ...req.body,
                manager: user.id
            })

            await project.save()

            res.json({
                msg: "Proyecto creado correctamente"
            })

        } catch (error) {
            res.status(500).json({
                error: "Hubo un error"
            })
        }
    }

    public static async getAllProject(req: Request, res: Response) {

        try {

            const projects = await Project.find({
                $or: [
                    { manager: req.user.id },
                    { team: req.user.id }
                ]
            })

            res.json(projects)

        } catch (error) {
            res.status(500).json({
                error: "Hubo un error"
            })
        }
    }

    public static async getProjectById(req: Request, res: Response) {

        try {

            const { project } = req

            await project.populate("tasks")

            res.json(project)

        } catch (error) {
            res.status(500).json({
                error: "Hubo un error"
            })
        }
    }

    public static async updateProject(req: Request, res: Response) {
        try {

            const { project } = req

            await project.updateOne(req.body)

            res.json({
                msg: "Proyecto actualizado correctamente"
            })

        } catch (error) {
            res.status(500).json({
                error: "Hubo un error"
            })
        }
    }

    public static async deleteProject(req: Request, res: Response) {
        try {

            const { project } = req

            await project.deleteOne()

            res.json({
                msg: "Proyecto eliminado correctamente"
            })

        } catch (error) {
            res.status(500).json({
                error: "Hubo un error"
            })
        }
    }
}

export default ProjectController