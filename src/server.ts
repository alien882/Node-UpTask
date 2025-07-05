import express from "express"
import { connectDB } from "./config/db"
import projectRoutes from "./routes/projectRoutes"
import cors from "cors"
import corsOptions from "./config/cors"
import morgan from "morgan"
import userRouters from "./routes/userRoutes"

connectDB()

const app = express()

app.use(cors(corsOptions))

app.use(morgan("dev"))

app.use(express.json())

app.use("/api/auth", userRouters)

app.use("/api/proyectos", projectRoutes)

export default app