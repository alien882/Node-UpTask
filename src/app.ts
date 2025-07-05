import chalk from "chalk";

import envs from "./config/envs";
import app from "./server";

const textGood = chalk.bold.blue.underline

app.listen(envs.PORT, () => {
    console.log(textGood(`REST API escuchando en el puerto ${envs.PORT}`))
})