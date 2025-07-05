import chalk from "chalk"
import mongoose from "mongoose"
import envs from "./envs"
import { exit } from "process"

const textOk = chalk.bold.green.underline
const textError = chalk.bold.red.underline

export const connectDB = async () => {
    try {
        await mongoose.connect(envs.MONGO_DB_URI, {
            dbName: envs.MONGO_DB_NAME
        })
        console.log(textOk("Conexión Exitosa!!!"))
    } catch (error) {
        console.error(textError(`Error de conexión ${error}`))
        exit(1)
    }
} 