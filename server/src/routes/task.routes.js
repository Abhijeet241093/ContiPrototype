import express from "express"
import model from '../model/index.js'
import _ from 'lodash'
import { ResponseData } from "../utilities/responseData.util.js"
import { validateToken } from '../utilities/middleware.util.js'
import { v4 } from "uuid"
const router = express.Router();

router.get("/", validateToken, async (req, res) => {
  try {
    const data = req.query
    let activity = await model.TaskEntity.query().findById(data.id)
    if (!activity) {
      res.status(200).json(new ResponseData(true, null, "Cannot get activity data"));
      return
    }
    res.status(200).json(new ResponseData(true, activity, "Success"));
  } catch (ex) {
    res.status(400).json(new ResponseData(false, null, ex.message));
  }
})

router.get("/getByProjectId", validateToken, async (req, res) => {
  try {
    const { id } = req.query
    let tasks = await model.TaskEntity.query().where({ projectId: id })
    res.status(200).json(new ResponseData(true, tasks, "Success"));
  } catch (ex) {
    res.status(400).json(new ResponseData(false, null, ex.message));
  }
})

router.get("/getAllByName", validateToken, async (req, res) => {
  try {
    const { tasks, projectId } = req.query
    let task = await model.TaskEntity.query().whereIn('name', tasks).where({ projectId }).select('name', 'status')
    res.status(200).json(new ResponseData(true, task, "Success"));
  } catch (ex) {
    res.status(400).json(new ResponseData(false, null, ex.message));
  }
})

router.get("/getAll", validateToken, async (req, res) => {
  try {
    let tasks = await model.TaskEntity.query().select()
    res.status(200).json(new ResponseData(true, tasks, "Success"));
  } catch (ex) {
    res.status(400).json(new ResponseData(false, null, ex.message));
  }
})


router.get("/getByTaskId", validateToken, async (req, res) => {
  try {
    const { taskId, name } = req.query
    let task = await model.TaskEntity.query().findOne({ taskId, name })
    if (!task) {
      res.status(400).json(new ResponseData(false, null, "Fail"));
    }else{
      res.status(200).json(new ResponseData(true, task, "Success"));
    }
  } catch (ex) {
    res.status(400).json(new ResponseData(false, null, ex.message));
  }
})

router.post("/", validateToken, async (req, res) => {
  try {
    const { taskId, name } = req.body;
    let task = await model.TaskEntity.query().findOne({ taskId, name })
    if (!task) {
      task = await model.TaskEntity.addAsync(req.body)
      res.status(200).json(new ResponseData(true, task, "Success"));
    } else {
      task = await model.TaskEntity.updateAsync(task.id, req.body)
      res.status(200).json(new ResponseData(true, task, "Success"));
    }
  } catch (ex) {
    res.status(400).json(new ResponseData(false, null, ex.message));
  }
});


export default router;
