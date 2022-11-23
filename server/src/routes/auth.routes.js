import express from "express"
import model from '../model/index.js'
import _ from 'lodash'
import { ResponseData } from "../utilities/responseData.util.js"
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await model.UserEntity.query().findOne({ email: email.toLowerCase() })
    if (!user) {
      res.status(400).json(new ResponseData(false, null, "Invalid credentials"));
      return;
    }
    let isValidate = await model.UserEntity.isValidPassword(password, user.passwordHash)
    if (!isValidate) {
      res.status(400).json(new ResponseData(false, null, "Invalid credentials"));
      return;
    }
    res.status(200).json(new ResponseData(true, {token: model.UserEntity.generateJWT(user) , user}, "Success"));
  } catch (ex) {
    res.status(400).json(new ResponseData(false, null, ex.message));
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await model.UserEntity.query().findOne({ email: email.toLowerCase() })
    if (!user) {
      user = await model.UserEntity.addUser(req.body)
      res.status(200).json(new ResponseData(true, {token: model.UserEntity.generateJWT(user) , user}, "Success"));
    } else {
      res.status(400).json(new ResponseData(false, null, "Email is existing"));
    }
  } catch (ex) {
    res.status(400).json(new ResponseData(false, null, ex.message));
  }
});

export default router;
