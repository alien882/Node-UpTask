import 'dotenv/config';
import * as env from 'env-var';

const envs = {
    PORT: env.get("PORT").required().asPortNumber(),
    MONGO_DB_URI: env.get("MONGO_DB_URI").required().asString(),
    MONGO_DB_NAME: env.get("MONGO_DB_NAME").required().asString(),
    FRONTEND_URL: env.get("FRONTEND_URL").required().asString(),
    MAILER_SERVICE: env.get("MAILER_SERVICE").required().asString(),
    MAILER_MAIL: env.get("MAILER_MAIL").required().asEmailString(),
    MAILER_SECRET_KEY: env.get("MAILER_SECRET_KEY").required().asString(),
    MAILER_PORT: env.get("MAILER_PORT").required().asPortNumber(),
    JWT_SECRET: env.get("JWT_SECRET").required().asString(),
}

export default envs