import { Request, Response } from "express";
import Task from "../models/Task";

class TaskController {
    public static async createTask(req: Request, res: Response) {
        try {

            const { project } = req

            const task = new Task({
                ...req.body,
                project: project.id
            })

            project.tasks.push(task.id)

            await Promise.allSettled([task.save(), project.save()])

            res.json({
                msg: "Tarea creada correctamente"
            })
        } catch (error) {
            res.status(500).json({
                error: "Hubo un error"
            })
        }
    }

    public static async getTasksByProject(req: Request, res: Response) {
        try {

            const tasks = await Task.find({ project: req.project.id })
                .populate("project", "-tasks")

            res.json(tasks)

        } catch (error) {
            res.status(500).json({
                error: "Hubo un error"
            })
        }
    }

    public static async getTaskById(req: Request, res: Response) {
        try {

            const { task } = req

            await Promise.allSettled([
                task.populate("changedBy.user", "_id name email"),
                task.populate({
                    path: "notes",
                    populate: {
                        path: "createdBy",
                        select: "_id name email"
                    }
                })
            ])

            res.json(task)

        } catch (error) {
            res.status(500).json({
                error: "Hubo un error"
            })
        }
    }

    public static async updateTask(req: Request, res: Response) {
        try {

            const { task } = req

            await task.updateOne(req.body)

            res.json({
                msg: "Tarea actualizada correctamente"
            })

        } catch (error) {
            res.status(500).json({
                error: "Hubo un error"
            })
        }
    }

    public static async deleteTaskById(req: Request, res: Response) {
        try {

            const { project, task, params: { taskId } } = req

            project.tasks = project.tasks.filter(idTask => !idTask.equals(taskId))

            await Promise.allSettled([
                project.save(),
                task.deleteOne(),
            ])

            res.json({
                msg: "Tarea eliminada correctamente"
            })

        } catch (error) {
            res.status(500).json({
                error: "Hubo un error"
            })
        }
    }

    public static async updateTaskStatus(req: Request, res: Response) {
        try {

            const { body: { status }, task, user } = req

            task.status = status
            task.changedBy.push({
                user: user.id,
                status
            })
            await task.save()

            res.json({
                msg: "Status actualizado correctamente"
            })

        } catch (error) {
            res.status(500).json({
                error: "Hubo un error"
            })
        }
    }
}

export default TaskController