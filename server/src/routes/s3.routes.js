import express from 'express'
import { createPublicUrl,createPublicPutUrl, deleteFile } from '../services/s3.services.js';
import { validateToken } from '../utilities/middleware.util.js';
import { ResponseData } from '../utilities/responseData.util.js';
const router = express.Router();

router.get("/get-link", validateToken, async (req, res) => {
    try {
        const key = req.query.key;
        let link = await createPublicUrl(key)
        res.status(200).json(new ResponseData(true, link, "Success"));
    } catch (ex) {
        res.status(400).json(new ResponseData(false, null, ex.message));
    }
});

router.get("/put-link", validateToken,async (req, res) => {
    try {
        const { key, typeFile } = req.query;
        let link = await createPublicPutUrl(key, typeFile)
        res.status(200).json(new ResponseData(true, link, "Success"));
    } catch (ex) {
        res.status(400).json(new ResponseData(false, null, ex.message));
    }

});

router.delete("/", validateToken,async (req, res) => {
    try {
        const { key } = req.query;
         await deleteFile(key)
        res.status(200).json(new ResponseData(true, true, "Success"));
    } catch (ex) {
        res.status(400).json(new ResponseData(false, null, ex.message));
    }

});


export default router
