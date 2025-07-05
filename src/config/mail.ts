import nodemailer from "nodemailer"
import envs from "./envs"

const transporter = nodemailer.createTransport({
    service: envs.MAILER_SERVICE,
    port: envs.MAILER_PORT,
    secure: true,
    auth: {
        user: envs.MAILER_MAIL,
        pass: envs.MAILER_SECRET_KEY
    }
})

export default transporter