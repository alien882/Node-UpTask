import { NextFunction, Request, Response } from 'express';
import User, { IUser } from '../models/User';
import Token from '../models/Token';
import { checkPassword, generateToken } from '../helpers';
import AuthEmail from '../emails/AuthEmail';
import { HydratedDocument } from 'mongoose';
import envs from '../config/envs';
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user: HydratedDocument<IUser>
        }
    }
}

export async function userExists(req: Request, res: Response, next: NextFunction) {

    try {

        const user = await User.findOne({ email: req.body.email })

        if (user) {
            return res.status(409).json({
                errors: [{
                    msg: "El correo ya está registrado"
                }]
            })
        }

        next()

    } catch (error) {
        res.status(500).json({
            error: "Hubo un error"
        })
    }
}


export async function loginValid(req: Request, res: Response, next: NextFunction) {

    try {

        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({
                errors: [{
                    msg: "El usuario no existe"
                }]
            })
        }

        if (!user.confirmed) {

            const token = new Token({
                token: generateToken(),
                user: user.id
            })

            await token.save()

            AuthEmail.sendConfirmationEmail({
                email: user.email,
                userName: user.name,
                token: token.token
            })

            return res.status(401).json({
                errors: [{
                    msg: "El usuario no está confirmado, hemos enviado un email de confirmación"
                }]
            })
        }

        const isPasswordCorrect = await checkPassword(password, user.password)

        if (!isPasswordCorrect) {
            return res.status(401).json({
                errors: [{
                    msg: "El password es incorrecto"
                }]
            })
        }

        req.user = user

        next()

    } catch (error) {
        res.status(500).json({
            error: "Hubo un error"
        })
    }
}


export async function validRequestCode(req: Request, res: Response, next: NextFunction) {

    try {

        const user = await User.findOne({ email: req.body.email })

        if (!user) {
            return res.status(404).json({
                errors: [{
                    msg: "El usuario no está registrado"
                }]
            })
        }

        if (user.confirmed) {
            return res.status(403).json({
                errors: [{
                    msg: "El usuario ya está confirmado"
                }]
            })
        }

        req.user = user

        next()

    } catch (error) {
        res.status(500).json({
            error: "Hubo un error"
        })
    }
}


export async function validForgotPassword(req: Request, res: Response, next: NextFunction) {

    try {

        const user = await User.findOne({ email: req.body.email })

        if (!user) {
            return res.status(404).json({
                errors: [{
                    msg: "El usuario no está registrado"
                }]
            })
        }

        if (!user.confirmed) {
            return res.status(403).json({
                errors: [{
                    msg: "El usuario no está confirmado"
                }]
            })
        }

        req.user = user

        next()

    } catch (error) {
        res.status(500).json({
            error: "Hubo un error"
        })
    }
}


export async function authenticateUser(req: Request, res: Response, next: NextFunction) {

    try {

        const { authorization } = req.headers

        if (!authorization) {
            return res.status(401).json({
                errors: [{
                    msg: "No está autorizado"
                }]
            })
        }

        const token = authorization.split(" ")[1]

        try {

            const decoded = jwt.verify(token, envs.JWT_SECRET)

            if (typeof decoded === "object") {
                const user = await User.findById(decoded.id).select("_id name email")

                if (!user) {
                    return res.status(401).json({
                        errors: [{
                            msg: "Token no válido"
                        }]
                    })
                }

                req.user = user
                next()
            }

        } catch (error) {
            return res.status(401).json({
                errors: [{
                    msg: "Token no válido"
                }]
            })
        }

    } catch (error) {
        res.status(500).json({
            error: "Hubo un error"
        })
    }
}


export async function validUdpdateUser(req: Request, res: Response, next: NextFunction) {

    try {

        const { email } = req.body
        const { user } = req

        const userExists = await User.findOne({ email })

        if (userExists && !userExists._id.equals(user._id)) {
            return res.status(409).json({
                errors: [{
                    msg: "El correo ya está registrado"
                }]
            })
        }

        next()

    } catch (error) {
        res.status(500).json({
            error: "Hubo un error"
        })
    }
}