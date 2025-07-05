import envs from "../config/envs";
import transporter from "../config/mail";

interface EmailOptions {
    email: string;
    userName: string;
    token: string;
}

class AuthEmail {

    public static async sendConfirmationEmail({ email, userName, token }: EmailOptions) {

        const info = await transporter.sendMail({
            to: email,
            subject: "UpTask - Confirma tu Cuenta",
            html: `
                <p>Hola, ${userName}!, has creado tu cuenta en UpTask</p>
                <p>Ya casi está todo listo, solo debes confirmar tu cuenta</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${envs.FRONTEND_URL}/auth/confirmar-cuenta">
                    Confirmar cuenta
                </a>
                <p>E ingresa el código: <b>${token}</b></p>
                <p>Este token exprira en 10 minutos</p>
            `
        })

        console.log(info.messageId)
    }


    public static async sendResetPasswordEmail({ email, userName, token }: EmailOptions) {

        await transporter.sendMail({
            to: email,
            subject: "UpTask - Reestablece tu Password",
            html: `
                <p>Hola, ${userName}!, has solicitado reestablecer tu password</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${envs.FRONTEND_URL}/auth/nuevo-password">
                    Reestablecer Password
                </a>
                <p>E ingresa el código: <b>${token}</b></p>
                <p>Este token exprira en 10 minutos</p>
            `
        })
    }
}


export default AuthEmail