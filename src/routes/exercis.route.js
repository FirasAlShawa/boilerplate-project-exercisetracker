import express from 'express'
import ExercisController from '../controllers/exercis.controller';

const route = express.Router();

route.post("/",ExercisController.addNewExercis)

export default route;