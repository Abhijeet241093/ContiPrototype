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
        let activity = await model.ActivityEntity.query().findById(data.id)
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
      let activities = await model.ActivityEntity.query().where({ projectId: id })
      res.status(200).json(new ResponseData(true, activities, "Success"));
  } catch (ex) {
      res.status(400).json(new ResponseData(false, null, ex.message));
  }
})

router.get("/getById", validateToken, async (req, res) => {
  try {
      const { id ,projectId} = req.query
      let activities = await model.ActivityEntity.query().findOne({ id ,projectId})
      res.status(200).json(new ResponseData(true, activities, "Success"));
  } catch (ex) {
      res.status(400).json(new ResponseData(false, null, ex.message));
  }
})

router.get("/getByRange", validateToken, async (req, res) => {
  try {
      const {ids,projectId} = req.query
      let activities = await model.ActivityEntity.query().whereIn('id', ids).where({projectId}) .select('id','name',  'flows')
      res.status(200).json(new ResponseData(true, activities, "Success"));
  } catch (ex) {
      res.status(400).json(new ResponseData(false, null, ex.message));
  }
})

router.get("/getAll", validateToken, async (req, res) => {
    try {
        let activities = await model.ActivityEntity.query().select()
        res.status(200).json(new ResponseData(true, activities, "Success"));
    } catch (ex) {
        res.status(400).json(new ResponseData(false, null, ex.message));
    }
})

router.post("/",validateToken, async (req, res) => {
    try {
      const { name,projectId } = req.body;
      let activity = await model.ActivityEntity.query().findOne({ name: name.toLowerCase() ,projectId})
      if (!activity) {
        req.body.id = v4()
        activity = await model.ActivityEntity.addAsync(req.body)
        res.status(200).json(new ResponseData(true, activity, "Success"));
      } else {
        res.status(400).json(new ResponseData(false, null, "activity is existing"));
      }
    } catch (ex) {
      res.status(400).json(new ResponseData(false, null, ex.message));
    }
  });

export default router;
