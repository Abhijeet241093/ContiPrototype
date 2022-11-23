import express from "express"
import model from '../model/index.js'
import _ from 'lodash'
import { ResponseData } from "../utilities/responseData.util.js"
import { validateToken } from '../utilities/middleware.util.js'
const router = express.Router();

router.get("/", validateToken, async (req, res) => {
    try {
        const { email } = req.decoded;
        let user = await model.UserEntity.query().findOne({ email: email.toLowerCase() })
        if (!user) {
            res.status(200).json(new ResponseData(true, null, "Cannot get user data"));
            return
        }
        delete user.passwordHash
        res.status(200).json(new ResponseData(true, user, "Success"));
    } catch (ex) {
        res.status(400).json(new ResponseData(false, null, ex.message));
    }
});

router.get("/getUsers", validateToken, async (req, res) => {
    try {
        const { users } = req.query;
        let user = await model.UserEntity.query().whereIn('id', users).select('id', 'userName')
        res.status(200).json(new ResponseData(true, user, "Success"));
    } catch (ex) {
        res.status(400).json(new ResponseData(false, null, ex.message));
    }
});

router.put("/", validateToken, async (req, res) => {
    try {
        const { email } = req.decoded;
        const data = req.body;
        let user = await model.UserEntity.query().findOne({ email: email.toLowerCase() })
        if (!user) {
            res.status(400).json(new ResponseData(false, null, "Cannot update user data"));
            return
        }
        user.userName = data.userName
        user.role = data.role
        user.title = data.title
        user.walletAddress = data.walletAddress
        await model.UserEntity.updateUser(email, user)
        res.status(200).json(new ResponseData(true, user, "Success"));
    } catch (ex) {
        res.status(400).json(new ResponseData(false, null, ex.message));
    }
});


export default router;
