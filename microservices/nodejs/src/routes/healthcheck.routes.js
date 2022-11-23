import express from "express"
import _ from 'lodash'
import { ResponseData } from "../utilities/responseData.util.js"

const router = express.Router();

router.get("/", async (req, res) => {
    res.status(200).json(new ResponseData(true, "Api called1.", "Success"));
 });
 

export default router;