import { Request, Response } from "express"
import User from "../models/User"
import Project from "../models/Proyect"

class TeamController {

    public static async findMemberByEmail(req: Request, res: Response) {

        try {

            const { email } = req.body

            const user = await User.findOne({ email }).select("_id email name")

            if (!user) {
                return res.status(404).json({
                    errors: [
                        {
                            msg: "Usuario no encontrado"
                        }
                    ]
                })
            }

            res.json(user)

        } catch (error) {
            res.status(500).json({
                error: "Hubo un error"
            })
        }
    }

    public static async addMemberById(req: Request, res: Response) {
        try {

            const { id } = req.body
            const { project } = req

            const user = await User.findById(id).select("_id")

            if (!user) {
                return res.status(404).json({
                    errors: [
                        {
                            msg: "Usuario no encontrado"
                        }
                    ]
                })
            }

            if (project.team.includes(user.id) || project.manager.equals(user.id)) {
                return res.status(409).json({
                    errors: [
                        {
                            msg: "El usuario ya es miembro o manager de este proyecto"
                        }
                    ]
                })
            }

            project.team.push(user.id)

            await project.save()

            res.json({
                msg: "Usuario agregado correctamente"
            })

        } catch (error) {
            res.status(500).json({
                error: "Hubo un error"
            })
        }
    }


    public static async removeMemberById(req: Request, res: Response) {

        try {

            const { project } = req
            const { memberId } = req.params

            if (!project.team.some(member => member.equals(memberId))) {
                return res.status(409).json({
                    errors: [
                        {
                            msg: "El usuario no existe en este proyecto"
                        }
                    ]
                })
            }

            project.team = project.team.filter(member => !member.equals(memberId))

            await project.save()

            res.json({
                msg: "Miembro eliminado correctamente"
            })

        } catch (error) {
            res.status(500).json({
                error: "Hubo un error"
            })
        }
    }

    public static async getMembersByProyect(req: Request, res: Response) {

        try {

            const project = await Project.findById(req.project.id)
                .select("team")
                .populate("team", "_id email name")

            res.json(project?.team)

        } catch (error) {
            res.status(500).json({
                error: "Hubo un error"
            })
        }
    }
}


export default TeamController