import express from 'express'
import UserController from '../controllers/user.controller.js';

const route = express.Router();

route.post("/",UserController.createNewUser)
route.get("/:id",UserController.getUserDetails)
route.post("/:id/exercises",UserController.addNewExercisToUser)
route.get("/:id/logs",UserController.userLogs)
export default route;