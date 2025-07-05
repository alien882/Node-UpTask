import { NextFunction, Request, Response } from "express";
import Note, { INote } from "../models/Note";
import { HydratedDocument } from "mongoose";

declare global {
    namespace Express {
        interface Request {
            note: HydratedDocument<INote>
        }
    }
}

export async function noteExists(req: Request, res: Response, next: NextFunction) {

    try {

        const { noteId } = req.params

        const note = await Note.findById(noteId)

        if (!note) {
            return res.status(404).json({
                errors: [{
                    msg: "Nota no encontrada"
                }]
            })
        }

        req.note = note

        next()

    } catch (error) {
        res.status(500).json({
            error: "Hubo un error"
        })
    }
}


export async function noteBelongsToUser(req: Request, res: Response, next: NextFunction) {

    const { note, user } = req

    if (!note.createdBy.equals(user.id)) {
        return res.status(400).json({
            errors: [
                {
                    msg: "Solo el dueño de la nota puede realizar esta acción"
                }
            ]
        })
    }

    next()
}