const tf = require('@tensorflow/tfjs');
const tfn = require("@tensorflow/tfjs-node")
const { loadGraphModel } = require('@tensorflow/tfjs-converter');
const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
let response;

let classesDir = {
    3: {
        name: 'worker_with_helmet',
        id: 3,
    },
    3: {
        name: 'worker_without_helmet',
        id: 3,
    }
}

exports.lambdaHandler = async (event, context) => {
    try {
       let data=  test()
        response = {
            'statusCode': 200,
            'body': JSON.stringify(data)
        }
        return response
    } catch (err) {
        console.log(err);
        return err;
    }
};

const test = async () => {
    try {
        const model = await loadGraphModel('C:\Users\Abhijeet\Desktop\Yes\chung-ang-prototype-main\client\public\yolov5n_web_model\model.json');
        // var video_frame = document.getElementById('frame');
        // const ctx = this.canvasRef.current.getContext("2d");
        // https://chungangprototype.s3.ap-southeast-1.amazonaws.com/models/hemlet_detector/model.json
   
       return detectFrame('https://media.istockphoto.com/photos/worker-with-chainsaw-picture-id123362063?k=20&m=123362063&s=612x612&w=0&h=XvfyT-m5Bqfz76e0vhNTH_fD4yWftoFcwOygEC6YajQ=', model);
    } catch (err) {
        console.log(err);
        return err;
    }
}

async function detectFrame(image, model, video_frame) {
    tf.engine().startScope();
    let data = await axios.get(image, { responseType: 'arraybuffer' })
    const buffer = Buffer.from(data.data, "utf-8")
    const tfimg = tfn.node.decodeImage(buffer);
    const expandedimg = tfimg.transpose([0, 1, 2]).expandDims();
    let predictions = await model.executeAsync(expandedimg)
    // renderPredictions(predictions, video_frame);
   
    let  result = renderPredictions(predictions)
    tf.engine().endScope();
    return result
};

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
            bbox[2] = maxX - minX;
            bbox[3] = maxY - minY;
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