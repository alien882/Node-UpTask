import { Router } from "express";
import UserController from "../controllers/UserController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { authenticateUser, loginValid, userExists, validForgotPassword, validRequestCode, validUdpdateUser } from "../middleware/user";
import { tokenExists, tokenExistsParams } from "../middleware/token";

const router = Router()

router.post(
    "/crear-cuenta",
    body("name").notEmpty().withMessage("El nombre es obligatorio"),
    body("password").isLength({ min: 8 }).withMessage("El password no debe ser menor de 8 caracteres"),
    body("password_confirmation").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Los passwords no son iguales")
        }

        return true
    }),
    body("email").isEmail().withMessage("Debe ser un correo válido"),
    handleInputErrors,
    userExists,
    UserController.createAccount
)


router.post(
    "/confirmar-cuenta",
    body("token").notEmpty().withMessage("El token es obligatorio"),
    handleInputErrors,
    tokenExists,
    UserController.confirmAccount
)

router.post(
    "/login",
    body("email").notEmpty().withMessage("El email es obligatorio"),
    body("password").notEmpty().withMessage("El password es obligatorio"),
    handleInputErrors,
    loginValid,
    UserController.login
)


router.post(
    "/solicitar-codigo",
    body("email").notEmpty().withMessage("El email es obligatorio"),
    handleInputErrors,
    validRequestCode,
    UserController.requestConfirmationCode
)


router.post(
    "/olvide-password",
    body("email").notEmpty().withMessage("El email es obligatorio"),
    handleInputErrors,
    validForgotPassword,
    UserController.forgotPassword
)


router.post(
    "/validar-token",
    body("token").notEmpty().withMessage("El token es obligatorio"),
    handleInputErrors,
    tokenExists,
    UserController.validateToken
)

router.post(
    "/actualizar-password/:token",
    param("token").isNumeric().withMessage("Token no válido"),
    body("password").isLength({ min: 8 }).withMessage("El password no debe ser menor de 8 caracteres"),
    body("password_confirmation").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Los passwords no son iguales")
        }

        return true
    }),
    handleInputErrors,
    tokenExistsParams,
    UserController.updatePasswordWithToken
)

router.get(
    "/usuario",
    authenticateUser,
    UserController.getUser
)

router.put(
    "/perfil",
    authenticateUser,
    body("name").notEmpty().withMessage("El nombre es obligatorio"),
    body("email").isEmail().withMessage("Debe ser un correo válido"),
    handleInputErrors,
    validUdpdateUser,
    UserController.updateUser
)

router.put(
    "/cambiar-password",
    authenticateUser,
    body("current_password").notEmpty().withMessage("El password actual es obligatorio"),
    body("password").isLength({ min: 8 }).withMessage("El password no debe ser menor de 8 caracteres"),
    body("password_confirmation").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Los passwords no son iguales")
        }

        return true
    }),
    handleInputErrors,
    UserController.changePassword
)

router.post(
    "/revisar-password",
    authenticateUser,
    body("password").notEmpty().withMessage("El password es obligatorio"),
    handleInputErrors,
    UserController.checkPassword
)

export default router
