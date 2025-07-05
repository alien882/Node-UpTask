import { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, generateJWT, generateToken, hashearPassword } from "../helpers";
import Token from "../models/Token";
import AuthEmail from "../emails/AuthEmail";

class UserController {

    public static async createAccount(req: Request, res: Response) {

        try {

            const user = new User(req.body)
            user.password = await hashearPassword(user.password)

            const token = new Token({
                token: generateToken(),
                user: user.id
            })

            await Promise.allSettled([user.save(), token.save()])

            AuthEmail.sendConfirmationEmail({
                email: user.email,
                userName: user.name,
                token: token.token
            })

            res.json({
                msg: "Cuenta creada correctamente, revisa tu email para verificar tu cuenta"
            })

        } catch (error) {
            res.status(500).json({
                error: "Hubo un error"
            })
        }
    }


    public static async confirmAccount(req: Request, res: Response) {

        try {

            const { token } = req

            const user = await User.findById(token.user)

            if (!user) {
                return res.status(404).json({
                    errors: [
                        {
                            msg: "usuario no encontrado"
                        }
                    ]
                })
            }

            user.confirmed = true

            await Promise.allSettled([user.save(), token.deleteOne()])

            res.json({
                msg: "Cuenta confirmada correctamente"
            })

        } catch (error) {
            res.status(500).json({
                error: "Hubo un error"
            })
        }
    }


    public static async login(req: Request, res: Response) {

        try {

            const token = generateJWT({
                id: req.user.id
            })

            res.json({
                token
            })

        } catch (error) {
            res.status(500).json({
                error: "Hubo un error"
            })
        }
    }

    public static async requestConfirmationCode(req: Request, res: Response) {

        try {

            const { user } = req

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

            res.json({
                msg: "Se envió un nuevo token a tu e-mail"
            })

        } catch (error) {
            res.status(500).json({
                error: "Hubo un error"
            })
        }
    }


    public static async forgotPassword(req: Request, res: Response) {

        try {

            const { user } = req

            const token = new Token({
                token: generateToken(),
                user: user.id
            })

            await token.save()

            AuthEmail.sendResetPasswordEmail({
                email: user.email,
                userName: user.name,
                token: token.token
            })

            res.json({
                msg: "Revisa tu email y sigue las instrucciones"
            })

        } catch (error) {
            res.status(500).json({
                error: "Hubo un error"
            })
        }
    }


    public static async validateToken(req: Request, res: Response) {

        try {

            res.json({
                msg: "Token valido, define tu nuevo password"
            })

        } catch (error) {
            res.status(500).json({
                error: "Hubo un error"
            })
        }
    }


    public static async updatePasswordWithToken(req: Request, res: Response) {

        try {

            const user = await User.findById(req.token.user)

            if (!user) {
                return res.status(404).json({
                    errors: [
                        {
                            msg: "usuario no encontrado"
                        }
                    ]
                })
            }

            user.password = await hashearPassword(req.body.password)

            await Promise.allSettled([req.token.deleteOne(), user.save()])

            res.json({
                msg: "El password se modificó correctamente"
            })

        } catch (error) {
            res.status(500).json({
                error: "Hubo un error"
            })
        }
    }


    public static async getUser(req: Request, res: Response) {

        try {

            res.json({
                user: req.user
            })

        } catch (error) {
            res.status(500).json({
                error: "Hubo un error"
            })
        }
    }


    public static async updateUser(req: Request, res: Response) {

        try {

            const { name, email } = req.body
            const { user } = req

            user.name = name
            user.email = email

            await user.save()

            res.json({
                msg: "Perfil actualizado correctamente"
            })

        } catch (error) {
            res.status(500).json({
                error: "Hubo un error"
            })
        }
    }

    public static async changePassword(req: Request, res: Response) {

        try {

            const { current_password, password } = req.body

            const user = await User.findById(req.user.id)

            const isPasswordCorrect = await checkPassword(current_password, user!.password)

            if (!isPasswordCorrect) {
                return res.status(401).json({
                    errors: [
                        {
                            msg: "Contraseña actual incorrecta"
                        }
                    ]
                })
            }

            user!.password = await hashearPassword(password)

            await user!.save()

            res.json({
                msg: "Password actualizado correctamente"
            })

        } catch (error) {
            res.status(500).json({
                error: "Hubo un error"
            })
        }
    }

    public static async checkPassword(req: Request, res: Response) {

        try {

            const { password } = req.body

            const user = await User.findById(req.user.id)

            const isPasswordCorrect = await checkPassword(password, user!.password)

            if (!isPasswordCorrect) {
                return res.status(401).json({
                    errors: [
                        {
                            msg: "La contraseña es incorrecta"
                        }
                    ]
                })
            }

            res.json({
                msg: "Password correcto"
            })

        } catch (error) {
            res.status(500).json({
                error: "Hubo un error"
            })
        }
    }
}


export default UserController