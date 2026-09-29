import express from 'express'
import UserController from '../controllers/user.controller.js';

const route = express.Router();

// Express 4 doesn't catch rejected promises; forward them to the error handler
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

route.post("/",wrap(UserController.createNewUser))
route.get("/",wrap(UserController.getAllUsers))
route.get("/:id",wrap(UserController.getUserDetails))
route.post("/:id/exercises",wrap(UserController.addNewExercisToUser))
route.get("/:id/logs",wrap(UserController.userLogs))
export default route;
