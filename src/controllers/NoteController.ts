import { Request, Response } from "express";
import Note from "../models/Note";

class NoteController {

    public static async createNote(req: Request, res: Response) {

        try {

            const { content } = req.body
            const { user, task } = req

            const note = new Note({
                content,
                createdBy: user.id,
                task: task.id
            })

            task.notes.push(note.id)

            await Promise.allSettled([note.save(), task.save()])

            res.json({
                msg: "Nota creada correctamente"
            })

        } catch (error) {
            res.status(500).json({
                error: "Hubo un error"
            })
        }
    }


    public static async getNotesByTask(req: Request, res: Response) {

        try {

            const { task } = req

            const notes = await Note.find({ task: task.id })

            res.json(notes)

        } catch (error) {
            res.status(500).json({
                error: "Hubo un error"
            })
        }
    }


    public static async deleteNoteById(req: Request, res: Response) {

        try {

            const { note, task } = req

            task.notes = task.notes.filter(idNote => !idNote.equals(note.id))

            await Promise.allSettled([task.save(), note.deleteOne()])

            res.json({
                msg: "Nota eliminada correctamente"
            })

        } catch (error) {
            res.status(500).json({
                error: "Hubo un error"
            })
        }
    }
}


export default NoteController