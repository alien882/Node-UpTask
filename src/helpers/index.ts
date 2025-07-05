import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import envs from '../config/envs';
import { Types } from 'mongoose';

export async function hashearPassword(password: string) {

    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

export async function checkPassword(password: string, hashPassword: string) {

    return await bcrypt.compare(password, hashPassword)
}

export function generateToken() {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

interface Payload {
    id: Types.ObjectId
}

export function generateJWT(payload: Payload) {

    const token = jwt.sign(payload, envs.JWT_SECRET, {
        expiresIn: "30d"
    })

    return token
}
