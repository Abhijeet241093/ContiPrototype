import express from "express"
import _ from 'lodash'
import { ResponseData } from "../utilities/responseData.util.js"
import { validateToken } from '../utilities/middleware.util.js'
import tf from '@tensorflow/tfjs';
import tfn from "@tensorflow/tfjs-node"
import { loadGraphModel } from '@tensorflow/tfjs-converter';
import axios from 'axios'
import { createPublicUrl } from "../services/s3.services.js";

const router = express.Router();

let classesDir = {
  1: {
    name: 'Helmet',
    id: 1,
  },
  2: {
    name: 'No_Helmet',
    id: 2,
  }
  
}
let model =null
try {
  model = await loadGraphModel('https://chungangdemo.s3.ap-northeast-2.amazonaws.com/model/hemlet_detector/model.json');
}
catch {
   
}
router.post("/", async (req, res) => {
  try {
    const { key } = req.body;
    if (!model) {
      model = await loadGraphModel('https://chungangdemo.s3.ap-northeast-2.amazonaws.com/model/hemlet_detector/model.json');
    }
    let url = await createPublicUrl(key, 3000)
    let data = await detectFrame(url, model);
    res.status(200).json(new ResponseData(true, data, "Success"));
  }
  catch (ex) {
    res.status(400).json(new ResponseData(false, null, ex.message));
  }
});
//https://media.istockphoto.com/photos/worker-with-chainsaw-picture-id123362063?k=20&m=123362063&s=612x612&w=0&h=XvfyT-m5Bqfz76e0vhNTH_fD4yWftoFcwOygEC6YajQ='

async function detectFrame(image, model) {
  tf.engine().startScope();
  let data = await axios.get(image, { responseType: 'arraybuffer' })
  const buffer = Buffer.from(data.data, "utf-8")
  const tfimg = tfn.node.decodeImage(buffer);
  const expandedimg = tfimg.transpose([0, 1, 2]).expandDims();
  let predictions = await model.executeAsync(expandedimg)
  let result = renderPredictions(predictions)
  tf.engine().endScope();
  return result
};
detectFrame()


const renderPredictions = (predictions) => {
  const boxes = predictions[3].arraySync();
  const scores = predictions[1].arraySync();
  const classes = predictions[4].dataSync();
  const detections = buildDetectedObjects(scores, 0.5,
    boxes, classes, classesDir);

  return detections
};

function buildDetectedObjects(scores, threshold, boxes, classes, classesDir) {
  const detectionObjects = []
  // var video_frame = document.getElementById('frame');

  scores[0].forEach((score, i) => {
    if (score > threshold) {
      const bbox = [];
      const minY = boxes[0][i][0] * 1
      const minX = boxes[0][i][1] * 1
      const maxY = boxes[0][i][2] * 1
      const maxX = boxes[0][i][3] * 1
      bbox[0] = minX;
      bbox[1] = minY;
      bbox[2] = maxX// - minX;
      bbox[3] = maxY //- minY;
      detectionObjects.push({
        class: classes[i],
        label: classesDir[classes[i]].name,
        score: score.toFixed(4),
        bbox: bbox
      })
    }
  })
  return detectionObjects
}

export default router;