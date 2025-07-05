import { CorsOptions } from "cors";
import envs from "./envs";
import { Error } from "mongoose";

const whiteList = [
    envs.FRONTEND_URL,
]

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || whiteList.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error("Acceso denegado"))
        }
    }
}

export default corsOptions