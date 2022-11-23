import express from "express"
import model from '../model/index.js'
import _ from 'lodash'
import { ResponseData } from "../utilities/responseData.util.js"
import { validateToken } from '../utilities/middleware.util.js'
import { v4 } from "uuid"
const router = express.Router();

router.get("/getByProjectId", validateToken, async (req, res) => {
    try {
        const { id } = req.query
        // let projectRequests = await model.ProjectRequestEntity.query().where({ projectId: id })
        const join = await model.ProjectRequestEntity.query()
            .joinRelated('[activity, user, project]').select('ProjectRequest.id', 'ProjectRequest.userId', 'project.name as projectName', 'user.userName', 'user.role',  
            'activity.name as activityName' ,'ProjectRequest.activityId','ProjectRequest.projectId')
            .where('ProjectRequest.projectId', id)
        res.status(200).json(new ResponseData(true, join, "Success"));
    } catch (ex) {
        res.status(400).json(new ResponseData(false, null, ex.message));
    }
})

router.get("/getByUserId", validateToken, async (req, res) => {
    try {
        const { userId } = req.query
        const join = await model.ProjectRequestEntity.query()
            .joinRelated('[activity, user, project]').select('ProjectRequest.id', 'ProjectRequest.userId', 'project.name as projectName', 
            'user.userName', 'activity.name as activityName','ProjectRequest.activityId','ProjectRequest.projectId')
            .where('ProjectRequest.userId', userId)

        res.status(200).json(new ResponseData(true, join, "Success"));
    } catch (ex) {
        res.status(400).json(new ResponseData(false, null, ex.message));
    }
})

router.post("/", validateToken, async (req, res) => {
    try {
        const { userId, activityId, projectId } = req.body;
        let projectRequest = await model.ProjectRequestEntity.query().findOne({ userId, activityId, projectId })
        let workerActivity = await model.WorkerActivityEntity.query().findOne({ userId, activityId, projectId })
        if (!projectRequest && !workerActivity) {
            req.body.id = v4()
            projectRequest = await model.ProjectRequestEntity.addAsync(req.body)
            res.status(200).json(new ResponseData(true, projectRequest, "Success"));
        } else {
            res.status(400).json(new ResponseData(false, null, "Worker with activity is existing"));
        }
    } catch (ex) {
        res.status(400).json(new ResponseData(false, null, ex.message));
    }
});

router.post("/approve", validateToken, async (req, res) => {
    const trx = await model.ProjectRequestEntity.startTransaction();
    try {
        const { id, projectId, activityId, userId } = req.body;
        let projectRequest = await model.ProjectRequestEntity.query().findById(id)
        if (projectRequest) {
            let obj = { id: v4(), projectId, activityId, userId }
            await model.WorkerActivityEntity.addAsync(obj)
            await model.ProjectRequestEntity.query().deleteById(id)
            res.status(200).json(new ResponseData(true, null, "Success"));
        } else {
            res.status(400).json(new ResponseData(false, null, "Cannot find this request"));
        }
        await trx.commit();
    } catch (ex) {
        res.status(400).json(new ResponseData(false, null, ex.message));
        await trx.rollback();
    }
});

router.post("/reject", validateToken, async (req, res) => {
    const trx = await model.ProjectRequestEntity.startTransaction();
    try {
        const { id } = req.body;
        await model.ProjectRequestEntity.query().findById(id).delete()
        res.status(200).json(new ResponseData(true, null, "Success"));
        await trx.commit();
    } catch (ex) {
        res.status(400).json(new ResponseData(false, null, ex.message));
        await trx.rollback();
    }
})

export default router;
