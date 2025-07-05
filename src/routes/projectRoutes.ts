import { Router } from "express";
import ProjectController from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { body, param } from "express-validator";
import { projectBelongsToManager, projectExist } from "../middleware/project";
import { authenticateUser } from "../middleware/user";
import TaskController from "../controllers/TaskController";
import { taskExist, taskBelongsToProject } from "../middleware/task";
import TeamController from "../controllers/TeamController";
import NoteController from "../controllers/NoteController";
import { noteBelongsToUser, noteExists } from "../middleware/note";

const router = Router()

router.post(
    "/",
    authenticateUser,
    body("projectName").notEmpty()
        .withMessage("El nombre del proyecto es obligatorio"),
    body("clientName").notEmpty()
        .withMessage("El nombre del cliente es obligatorio"),
    body("description").notEmpty()
        .withMessage("La descripción del proyecto es obligatorio")
    ,
    handleInputErrors,
    ProjectController.createProject
)

router.get(
    "/",
    authenticateUser,
    ProjectController.getAllProject
)

router.get(
    "/:projectId",
    authenticateUser,
    param("projectId").isMongoId().withMessage("projectId no válido"),
    handleInputErrors,
    projectExist,
    ProjectController.getProjectById
)

router.put(
    "/:projectId",
    authenticateUser,
    param("projectId").isMongoId().withMessage("projectId no válido"),
    body("projectName").notEmpty()
        .withMessage("El nombre del proyecto es obligatorio"),
    body("clientName").notEmpty()
        .withMessage("El nombre del cliente es obligatorio"),
    body("description").notEmpty()
        .withMessage("La descripción del proyecto es obligatorio"),
    handleInputErrors,
    projectExist,
    projectBelongsToManager,
    ProjectController.updateProject
)

router.delete(
    "/:projectId",
    authenticateUser,
    param("projectId").isMongoId().withMessage("projectId no válido"),
    handleInputErrors,
    projectExist,
    projectBelongsToManager,
    ProjectController.deleteProject
)


/// seccion de tareas
router.post(
    "/:projectId/tareas",
    authenticateUser,
    param("projectId").isMongoId().withMessage("projectId no válido"),
    body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),
    body("description").notEmpty().withMessage("La descripción de la tarea es obligatorio"),
    handleInputErrors,
    projectExist,
    projectBelongsToManager,
    TaskController.createTask
)

router.get(
    "/:projectId/tareas",
    authenticateUser,
    param("projectId").isMongoId().withMessage("projectId no válido"),
    handleInputErrors,
    projectExist,
    projectBelongsToManager,
    TaskController.getTasksByProject
)

router.get(
    "/:projectId/tareas/:taskId",
    authenticateUser,
    param("projectId").isMongoId().withMessage("projectId no válido"),
    param("taskId").isMongoId().withMessage("ID no válido"),
    handleInputErrors,
    projectExist,
    taskExist,
    taskBelongsToProject,
    TaskController.getTaskById
)

router.put(
    "/:projectId/tareas/:taskId",
    authenticateUser,
    param("projectId").isMongoId().withMessage("projectId no válido"),
    param("taskId").isMongoId().withMessage("ID no válido"),
    body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),
    body("description").notEmpty().withMessage("La descripción de la tarea es obligatorio"),
    handleInputErrors,
    projectExist,
    projectBelongsToManager,
    taskExist,
    taskBelongsToProject,
    TaskController.updateTask
)

router.delete(
    "/:projectId/tareas/:taskId",
    authenticateUser,
    param("projectId").isMongoId().withMessage("projectId no válido"),
    param("taskId").isMongoId().withMessage("ID no válido"),
    handleInputErrors,
    projectExist,
    projectBelongsToManager,
    taskExist,
    taskBelongsToProject,
    TaskController.deleteTaskById
)

router.patch(
    "/:projectId/tareas/:taskId",
    authenticateUser,
    param("projectId").isMongoId().withMessage("projectId no válido"),
    param("taskId").isMongoId().withMessage("ID no válido"),
    body("status").notEmpty().withMessage("El status de la tarea es obligatorio"),
    handleInputErrors,
    projectExist,
    taskExist,
    taskBelongsToProject,
    TaskController.updateTaskStatus
)



/// Seccion de team
router.post(
    "/:projectId/team/find",
    authenticateUser,
    param("projectId").isMongoId().withMessage("projectId no válido"),
    body("email").isEmail().toLowerCase().withMessage("El email no válido"),
    handleInputErrors,
    projectExist,
    projectBelongsToManager,
    TeamController.findMemberByEmail
)


router.post(
    "/:projectId/team",
    authenticateUser,
    param("projectId").isMongoId().withMessage("projectId no válido"),
    body("id").isMongoId().withMessage("ID no válido"),
    handleInputErrors,
    projectExist,
    projectBelongsToManager,
    TeamController.addMemberById
)

router.delete(
    "/:projectId/team/:memberId",
    authenticateUser,
    param("projectId").isMongoId().withMessage("projectId no válido"),
    param("memberId").isMongoId().withMessage("ID no válido"),
    handleInputErrors,
    projectExist,
    projectBelongsToManager,
    TeamController.removeMemberById
)

router.get(
    "/:projectId/team",
    authenticateUser,
    param("projectId").isMongoId().withMessage("projectId no válido"),
    handleInputErrors,
    projectExist,
    projectBelongsToManager,
    TeamController.getMembersByProyect
)



//// Seccion de Notas
router.post(
    "/:projectId/tareas/:taskId/notas",
    authenticateUser,
    param("projectId").isMongoId().withMessage("projectId no válido"),
    param("taskId").isMongoId().withMessage("ID no válido"),
    body("content").notEmpty().withMessage("El contenido de la nota es obligatorio"),
    handleInputErrors,
    projectExist,
    taskExist,
    taskBelongsToProject,
    NoteController.createNote
)

router.get(
    "/:projectId/tareas/:taskId/notas",
    authenticateUser,
    param("projectId").isMongoId().withMessage("projectId no válido"),
    param("taskId").isMongoId().withMessage("ID no válido"),
    handleInputErrors,
    projectExist,
    taskExist,
    taskBelongsToProject,
    NoteController.getNotesByTask
)


router.delete(
    "/:projectId/tareas/:taskId/notas/:noteId",
    authenticateUser,
    param("projectId").isMongoId().withMessage("projectId no válido"),
    param("taskId").isMongoId().withMessage("ID no válido"),
    param("noteId").isMongoId().withMessage("ID no válido"),
    handleInputErrors,
    projectExist,
    taskExist,
    taskBelongsToProject,
    noteExists,
    noteBelongsToUser,
    NoteController.deleteNoteById
)



export default router