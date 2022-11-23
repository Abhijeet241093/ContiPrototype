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
        let activity = await model.WorkerActivityEntity.query().findById(data.id)
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
        const { projectId } = req.query
        // const workerActivities = await model.WorkerActivityEntity.query().where({ projectId })
        // const activities = await model.WorkerActivityEntity.relatedQuery('activity').for(workerActivities)
        // const user = await model.WorkerActivityEntity.relatedQuery('user').for(workerActivities)
        const join = await model.WorkerActivityEntity.query()
             .joinRelated('[activity,user]').select('WorkerActivity.id','WorkerActivity.activityId','WorkerActivity.userId','user.userName','user.email', 'user.walletAddress', 'activity.flows', 'activity.id as activityId',
              'activity.name').where('WorkerActivity.projectId',projectId )
        let temp = {}
        join.forEach(i => {
            if (!temp[i.activityId]) {
                temp[i.activityId] = {name: i.name, activityId: i.activityId, workers:[], flows: i.flows,}
            }
            temp[i.activityId].workers.push({ userId: i.userId, userName: i.userName, email:i.email, walletAddress: i.walletAddress})
        })
        res.status(200).json(new ResponseData(true, temp, "Success"));
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

router.post("/", validateToken, async (req, res) => {
    try {
        const { name } = req.body;
        let activity = await model.WorkerActivityEntity.query().findOne({ name: name.toLowerCase() })
        if (!activity) {
            req.body.id = v4()
            activity = await model.WorkerActivityEntity.addAsync(req.body)
            res.status(200).json(new ResponseData(true, activity, "Success"));
        } else {
            res.status(400).json(new ResponseData(false, null, "worker activity is existing"));
        }
    } catch (ex) {
        res.status(400).json(new ResponseData(false, null, ex.message));
    }
});


export default router;
