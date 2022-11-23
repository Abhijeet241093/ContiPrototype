import React, { useEffect, useRef, useState } from "react";
import { Select, Button, message } from 'antd';
import { useNavigate, useSearchParams } from "react-router-dom";
import Camera from "../camera/Camera";
import { appStore } from "../../store/App.store";
import { getCurrentPosition, requestCA } from "../../functions/General.function";
import moment from "moment";
import axios from "axios";
import { v4 } from 'uuid'
import { ecsApi } from "../../constant/nodeAPI.ecs";
import { detectType } from "../../constant/detectType";
import * as tf from '@tensorflow/tfjs';
import { loadGraphModel } from '@tensorflow/tfjs-converter';
const { Option } = Select


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

function UploadPicturePage(props) {
  const navigate = useNavigate()
  const [isCheckCamera, setIsCheckCamera] = useState()
  const [search, setSearch] = useSearchParams();
  const [position, setPosition] = useState()
  const { captureImage, setCaptureImage, setIsLoading } = appStore()
  const [detect, setDetect] = useState()
  const ref = useRef()
  const refImg = useRef()

  useEffect(() => {

    if (captureImage && refImg.current) {
      let img = new Image()
      refImg.current.onload = async function () {
        const model = await loadGraphModel('https://chungangdemo.s3.ap-northeast-2.amazonaws.com/model/hemlet_detector/model.json');
        let frame = document.getElementById('task-image')
        // const frame = document.getElementById('frame');
        // let ratioW = img.width / refImg.current.width
        // let ratioH = img.height / refImg.current.height
        // console.log(img.width, ratioW)
        // console.log(ratioH, ratioW)
        img.width = frame.width
        img.height = frame.height
        ref.current.width = frame.width
        ref.current.height = frame.height
        detectFrame(this, model, frame)

      }
      // img.src = captureImage;
      refImg.current.src= captureImage
    }
  }, [captureImage, refImg.current])


  async function detectFrame(image, model, frame) {
    tf.engine().startScope();
    const expandedimg = processInput(image);
    let predictions = await model.executeAsync(expandedimg)
    let result = renderPredictions(predictions, frame)
    tf.engine().endScope();
    return result
  };


  const processInput = (image) => {
    const tfimg = tf.browser.fromPixels(image).toInt();
    const expandedimg = tfimg.transpose([0, 1, 2]).expandDims();
    return expandedimg;
  };

  const renderPredictions = (predictions, frame) => {

    const boxes = predictions[3].arraySync();
    const scores = predictions[1].arraySync();
    const classes = predictions[4].dataSync();
    const detections = buildDetectedObjects(scores, 0.5,
      boxes, classes, classesDir, frame);

    drawBox(detections, frame)
  };

  function buildDetectedObjects(scores, threshold, boxes, classes, classesDir, frame) {
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
  useEffect(() => {
    run()
  }, [])
  const run = async () => {
    let pos = await getCurrentPosition()
    if (pos) {
      setPosition(pos)
      if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        setIsCheckCamera(true)
      }

    }

  }
  const handleUpload = async () => {
    try {
      let d = document.getElementById('task-image')
      console.log(d.width)
      return
      if (!detect) return
      if (!ecsApi[detect]) return
      let url = ecsApi[detect]
      setIsLoading(true)

      const projectId = search.get('projectId')
      let key = `chungangPrototype/${projectId}/safety/${v4()}.jpg`

      const type = `image/${captureImage.split(';')[0].split('/')[1]}`
      let data2 = await requestCA('get', '/api/s3/put-link', null, { key, typeFile: type })
      if (!data2) {
        window.location.reload()
        return
      }
      console.log(type,)
      let img = dataURItoBlob(captureImage, type)
      await axios.put(data2.data, img, { // data1.data
        headers: {
          "Content-Encoding": 'base64',
          "Content-Type": type,
        },
      })
      let data = await requestCA('post', url, { key })
      console.log(data)
      drawBox(data.data)
      setIsLoading(false)
    } catch (e) {
      message.warning(e.message)
      setIsLoading(false)
    }

  }
  const drawBox = (detections, frame) => {

    const ctx = ref.current.getContext("2d");
    ctx.clearRect(0, 0, frame.width, frame.height);

    // Font options.
    let font = "16px sans-serif";
    ctx.font = font
    ctx.textBaseline = "top";
    detections.forEach(item => {
      const x = item['bbox'][0] * frame.offsetWidth;
      const y = item['bbox'][1] * frame.offsetHeight;
      const width = (item['bbox'][2] - item['bbox'][0]) * frame.offsetWidth;
      const height = (item['bbox'][3] - item['bbox'][1]) * frame.offsetHeight

      // Draw the bounding box.
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, width, height);
      // ctx.strokeRect(0, 0, 1920, 700);
      // Draw the label background.
      ctx.fillStyle = "#00FFFF";
      const textWidth = ctx.measureText(item["label"] + " " + (100 * item["score"]).toFixed(2) + "%").width;
      const textHeight = parseInt(font, 10); // base 10
      ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
    });

    detections.forEach(item => {
      const x = item['bbox'][0] * frame.offsetWidth;
      const y = item['bbox'][1] * frame.offsetHeight;

      // Draw the text last to ensure it's on top.
      ctx.fillStyle = "#000000";
      ctx.fillText(item["label"] + " " + (100 * item["score"]).toFixed(2) + "%", x, y);
    });
  }

  function dataURItoBlob(dataURI, type) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type });
  }
  const handleChange = (e) => {
    setDetect(e)
  }
  const dimension = {
    width: 800,
    height: 700
  }
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: 30, justifyContent: 'center' }} >
        <h2>Upload Image</h2>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: 'calc(100% - 30px)', flexDirection: 'column', padding: 5 }} >

        {!position && <h2> Turn on your GPS</h2>}
        {isCheckCamera ? (captureImage ?
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }} >
            <div style={{ width: '100%', aspectRatio: '2/1' }} >
              <div style={{ height: '100%', width: '100%', position: 'relative' }} >
                <img id="task-image" ref={refImg} style={{ position: 'absolute', width: '100%' ,height:'100%' }}
                //  width={dimension.width}
                //   height={dimension.height} 
                  />
                <canvas style={{ position: 'absolute' , width: '100%' ,height:'100%'}} ref={ref}
                  // width={dimension.width}
                  // height={dimension.height}
                />
              </div>
            </div>

            <div style={{ height: '200px' }} >
              <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: 5, fontSize: 20, fontWeight: 'bolder', justifyContent: 'space-evenly' }}>
                  <div style={{ width: '50%' }}>
                    <span>Date:</span>
                  </div>
                  <div style={{ width: '50%', color: 'gray' }}>
                    <span>{moment().format('DD/YY/MM hh:mm')}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 5, fontSize: 20, fontWeight: 'bolder', justifyContent: 'space-evenly' }}>
                  <div style={{ width: '50%' }}>
                    <span>Long:</span>
                  </div>
                  <div style={{ width: '50%', color: 'gray' }}>
                    <span>{position?.lng}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 5, fontSize: 20, fontWeight: 'bolder', justifyContent: 'space-evenly' }}>
                  <div style={{ width: '50%' }}>
                    <span>Lat:</span>
                  </div>
                  <div style={{ width: '50%', color: 'gray' }}>
                    <span>{position?.lat}</span>
                  </div>
                </div>

              </div>
              <div>
                <Select   className='bq-input' size="large" placeholder={'Detection Model'} style={{ width: '100%' }} value={detect} onChange={handleChange} >
                  {detectType.map(i =>
                    <Option key={i.key} value={i.value}>{i.name}</Option>
                  )}
                </Select>
              </div>
              <p />
              <div style={{ display: 'flex', justifyContent: 'space-evenly', gap: 5 }} >
                <Button size="large" block onClick={handleUpload} type="primary" >Upload</Button>
                <Button size="large" block onClick={() => setCaptureImage('')} type="danger">Cancel</Button>
              </div>
            </div>


            {/* <div>

              <img id="task-image" width={350} height={200} ref={refImg} style={{ position: 'absolute',}}/>
              <canvas width={350} height={200} style={{  position: 'absolute' }} ref={ref} />
            </div> */}



            {/* 
            <img id="task-image"// crossOrigin='anonymous'
              ref={refImg}
              // style={{ position: 'fixed' }}
              style={{ width:'100%', height:'100%' ,position: 'absolute', }}
              width={dimension.width}
              height={dimension.height}

            />
            <canvas
              // style={{ position: 'fixed' }}
              style={{  width:'100%', height:'100%' ,position: 'absolute' }}
              ref={ref}
              width={dimension.width}
              height={dimension.height}
            /> */}
          </div>



          :
          <Camera />
        )
          :
          <h2> Cannot detect camera</h2>
        }
      </div>
    </>


  );
}

export default (UploadPicturePage);
