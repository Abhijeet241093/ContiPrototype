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
        let project = await model.ProjectEntity.query().findById(data.id)
        if (!project) {
            res.status(200).json(new ResponseData(true, null, "Cannot get project data"));
            return
        }
        res.status(200).json(new ResponseData(true, project, "Success"));
    } catch (ex) {
        res.status(400).json(new ResponseData(false, null, ex.message));
    }
})

router.get("/getAll", validateToken, async (req, res) => {
    try {
        let projects = await model.ProjectEntity.query().select()
        res.status(200).json(new ResponseData(true, projects, "Success"));
    } catch (ex) {
        res.status(400).json(new ResponseData(false, null, ex.message));
    }
})

router.get("/getByUserId", validateToken, async (req, res) => {
    try {
        const { userId } = req.query
        let activities = await model.WorkerActivityEntity.query().where({ userId })
        let temp = {}
        let list = []
        activities.forEach(i => {
            if (!temp[i.projectId]) {
                temp[i.projectId] = i
                list.push(i.projectId)
            }
        })
        let projects = await model.ProjectEntity.query().findByIds(list)
        res.status(200).json(new ResponseData(true, projects, "Success"));
    } catch (ex) {
        res.status(400).json(new ResponseData(false, null, ex.message));
    }
})

router.post("/",validateToken, async (req, res) => {
    try {
      const { name } = req.body;
      let project = await model.ProjectEntity.query().findOne({ name: name.toLowerCase() })
      if (!project) {
        req.body.id = v4()
        project = await model.ProjectEntity.addAsync(req.body)
        res.status(200).json(new ResponseData(true, project, "Success"));
      } else {
        res.status(400).json(new ResponseData(false, null, "Project is existing"));
      }
    } catch (ex) {
      res.status(400).json(new ResponseData(false, null, ex.message));
    }
  });

router.put("/", validateToken, async (req, res) => {
    try {
        const data = req.body 
        await model.ProjectEntity.updateAsync(data.id, data)
        let project = await model.ProjectEntity.query().findById(data.id)
        if (!project) {
            res.status(400).json(new ResponseData(false, null, "Cannot update project data"));
            return
        }
        res.status(200).json(new ResponseData(true, project, "Success"));
    } catch (ex) {
        res.status(400).json(new ResponseData(false, null, ex.message));
    }
});


export default router;
