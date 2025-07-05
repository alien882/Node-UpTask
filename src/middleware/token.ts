import { NextFunction, Request, Response } from "express";
import Token, { IToken } from "../models/Token";
import { HydratedDocument } from "mongoose";

declare global {
    namespace Express {
        interface Request {
            token: HydratedDocument<IToken>
        }
    }
}

export async function tokenExists(req: Request, res: Response, next: NextFunction) {

    try {

        const { token: tokenBody } = req.body

        const token = await Token.findOne({ token: tokenBody })

        if (!token) {
            return res.status(404).json({
                errors: [{
                    msg: "Token no válido"
                }]
            })
        }

        req.token = token

        next()

    } catch (error) {
        res.status(500).json({
            error: "Hubo un error"
        })
    }
}


export async function tokenExistsParams(req: Request, res: Response, next: NextFunction) {

    try {

        const { token: tokenParams } = req.params

        const token = await Token.findOne({ token: tokenParams })

        if (!token) {
            return res.status(404).json({
                errors: [{
                    msg: "Token no válido"
                }]
            })
        }

        req.token = token

        next()

    } catch (error) {
        res.status(500).json({
            error: "Hubo un error"
        })
    }
}