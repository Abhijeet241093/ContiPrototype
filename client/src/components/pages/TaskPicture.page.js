import React, { useEffect, useRef, useState } from "react";
import { Select, Button, message } from 'antd';
import { useNavigate, useSearchParams } from "react-router-dom";
import Camera from "../camera/Camera";
import { appStore } from "../../store/App.store";
import { dataURItoBlob, getCurrentPosition, requestCA, userMediaAvailable } from "../../functions/General.function";
import moment from "moment";
import axios from "axios";
import { v4 } from 'uuid'
import { ecsApi } from "../../constant/nodeAPI.ecs";
import { detectType } from "../../constant/detectType";
import * as tf from '@tensorflow/tfjs';
import { loadGraphModel } from '@tensorflow/tfjs-converter';
import { BigNumber } from "ethers";
import _ from "lodash";
import mapboxgl from '!mapbox-gl';
import { initGeo } from "../../functions/Locaiton.function";
import { drawBoxHelmet } from "../../functions/Helmet.function.";
const { Option } = Select

const marker = new mapboxgl.Marker()
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
const defaultLocation = [126.9585, 37.5070]
function TaskPicturePage(props) {
  const navigate = useNavigate()
  const [isCheckCamera, setIsCheckCamera] = useState()
  const [search, setSearch] = useSearchParams();
  const [position, setPosition] = useState()
  const { captureImage, setCaptureImage, setIsLoading, contractInterface, user } = appStore()
  const [detect, setDetect] = useState()
  const ref = useRef()
  const refImg = useRef()
  const taskId = search.get('taskId')
  const projectId = search.get('projectId')
  const [isDetect, setIsDetect] = useState()
  const [detectData, setDetectData] = useState()
  const [taskName, setTaskName] = useState()
  const [activity, setActivity] = useState()
  const [nextStep, setNextStep] = useState()
  const [isLastStep, setIsLastStep] = useState()
  const [lng, setLng] = useState(null);
  const [lat, setLat] = useState(null);
  const [isCanConfirm, setIsCanConfirm] = useState()
  const [currentStep, setCurrentStep] = useState()
  const mapContainer = useRef(null);
  const map = useRef(null);
  useEffect(() => {
    run()
  }, [])
  useEffect(() => {
    if (captureImage && refImg.current) {
      let img = new Image()
      refImg.current.onload = async function () {
        let frame = document.getElementById('task-image')
        img.width = frame.width
        img.height = frame.height
        ref.current.width = frame.width
        ref.current.height = frame.height
      }
      refImg.current.src = captureImage
    }
  }, [captureImage, refImg.current])

  const run = async () => {
    setIsLoading(true)

    if (userMediaAvailable) {
      setIsCheckCamera(true)
    }
    let id = BigNumber.from(taskId)
    let tx1 = await contractInterface.taskManagerContract.getItemInfor([id])
    let item = tx1[0]
    let task = item[2]
    let status = item['status'] ? item['status'] : ''
    if (status !== 'inprocess') {
      navigate(-1)
    }
    let data = await requestCA('get', '/api/activity/getById', null, { id: task, projectId })
    if (data) {
      let index = _.findIndex(data.data.flows, o => { return o === item[6] })
      if (index >= 0) {
        setCurrentStep(data.data.flows[index])
        if (index === data.data.flows.length - 1) {
          setIsLastStep(true)
          setNextStep(data.data.flows[index])
        } else {
          setNextStep(data.data.flows[index + 1])
        }

      }
      setActivity(data.data)
      setDetect(data.data.detect)
    }
    console.log(item)
    setTaskName(task)
    setIsLoading(false)
    // let id = BigNumber.from(taskId)
    // let tx1 = await contractInterface.taskManagerContract.getItemInfor([id])
    // let item = tx1[0]
    // let task = item[2]
    // let data = await requestCA('get', '/api/activity/getByName', null, { name: task, projectId })
    // if (data) {
    //   setDetect(data.data.detect)
    // }
    // setTaskName(task)
    // setIsLoading(false)
  }
  const handleDetect = async () => {
    try {
      let url
      if (detect) {
        if (ecsApi[detect]) {
          url = ecsApi[detect]
        }
      }

      setIsLoading(true)


      let key = `chungangPrototype/${projectId}/${taskId}/${currentStep}.jpg`

      const type = `image/${captureImage.split(';')[0].split('/')[1]}`
      let data2 = await requestCA('get', '/api/s3/put-link', null, { key, typeFile: type })
      if (!data2) {
        window.location.reload()
        return
      }
      let img = dataURItoBlob(captureImage, type)
      await axios.put(data2.data, img, { // data1.data
        headers: {
          "Content-Encoding": 'base64',
          "Content-Type": type,
        },
      })
      if (url) {
        let data = await requestCA('post', url, { key })
        console.log(data)
        let frame = document.getElementById('task-image')
        const { detections, isCanConfirm } = drawBoxHelmet(data.data, frame, ref.current)
        setIsDetect(true)
        setDetectData(detections)
        setIsCanConfirm(isCanConfirm)
      } else {
        setIsDetect(true)
        setDetectData([])
        setIsCanConfirm(true)
      }


      setIsLoading(false)
    } catch (e) {
      message.warning(e.message)
      setIsLoading(false)
    }

  }

  const handleConfirm = async () => {
    if (!isCanConfirm) return
    if (isLastStep) {
      if (!user.walletAddress) {
        message.warning('You need to setup your wallet to get reward')
        return
      }
    }
    try {

      setIsLoading(true)

      let clone = {
        projectId,
        id: v4(),
        taskId,
        detectData,
        userId: user.id,
        name: currentStep,
      }
      console.log(isLastStep)

      let data = await requestCA('post', '/api/task', clone)
      if (data) {
        let id = BigNumber.from(taskId)
        let tx
        if (isLastStep) {
          tx = await contractInterface.taskManagerContract.updateLastStepTask(
            id,
            nextStep)
        } else {
          tx = await contractInterface.taskManagerContract.updateTask(
            id,
            nextStep)
        }

        await tx.wait()
        navigate(`/tasks?projectId=${projectId}`)
      }

      setIsLoading(false)
    }
    catch {
      setIsLoading(false)
    }

  }
  const handleCamera = () => {
    if (userMediaAvailable) {
      navigator.mediaDevices.getUserMedia(cameraSetting).then((stream) => {
        navigate(0)
      })
        .catch(err => {
          message.warning(err.message)
          console.log(err)
        })
    } else {
      message.warning('You cannot access camera')
    }
  }
  const handleLocation = async () => {
    setPosition({ lat: lat, lng: lng })
  }
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      // setZoom(map.current.getZoom().toFixed(2));
      marker.setLngLat([map.current.getCenter().lng, map.current.getCenter().lat])
    });

  }, [map.current]);
  useEffect(() => {
    if (mapContainer.current && !map.current) {
      const run = async () => {
        map.current = await initGeo(mapContainer.current, marker, setLng, setLat)
      }
      run()
    }
  }, [mapContainer.current, map.current]);


  const handleReLocation = () => {
    setCaptureImage()
    setPosition()
  }
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: 30, justifyContent: 'center',backgroundImage: 'url(https://i.postimg.cc/8zt2YPhf/Backpage.png)' }} >
        <h2>Upload Image</h2>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: 'calc(100% - 30px)', flexDirection: 'column', padding: 5 }} >

        <div style={{ display: !position ? 'flex' : 'none', width: '100%', height: '100%', justifyContent: 'center', flexDirection: 'column' }}>
          <div style={{ width: '100%', height: 'calc(100% - 40px)' }} >
            <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
          </div>
          <p />
          <Button className="bq-custom-button large block" onClick={handleLocation} type="primary">Set Location</Button>
        </div>

        {(position && (isCheckCamera ? (captureImage ?
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', }} >
            <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center' }} >
              <div style={{ width: '200px', height: '100%', position: 'relative' }} >
                <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center' }} >
                  <img id="task-image" width={200} ref={refImg}
                  />
                  <canvas width={200} style={{ position: 'absolute', }} ref={ref}
                  />
                </div>
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

              <p />
              <div style={{ display: 'flex', justifyContent: 'space-evenly', gap: 5 }} >
                {!isDetect ? <Button className="bq-custom-button large block" onClick={handleDetect} type="primary" >Detect</Button>
                  :
                  <Button className="bq-custom-button large block" onClick={handleConfirm} disabled={!isCanConfirm} type="primary" >Confirm</Button>
                }
                <Button className="bq-custom-button large block cancel" onClick={() => {
                  setIsDetect(false)
                  setDetectData(null)
                  setCaptureImage('')
                }} >Cancel</Button>
              </div>
              <p />
              <Button className="bq-custom-button large block" onClick={handleReLocation} >
                Set Location
              </Button>
            </div>
          </div>
          :
          <Camera />
        )
          :
          <Button type='primary' onClick={handleCamera} >
            Turn on camera
          </Button>
        ))}
      </div>
    </>


  );
}

export default (TaskPicturePage);

  // const drawBox = (detections) => {

  //   const ctx = ref.current.getContext("2d");
  //   ctx.clearRect(0, 0, frame.width, frame.height);

  //   // Font options.
  //   let font = "16px sans-serif";
  //   ctx.font = font
  //   ctx.textBaseline = "top";
  //   detections.forEach(item => {
  //     const x = item['bbox'][0] * frame.offsetWidth;
  //     const y = item['bbox'][1] * frame.offsetHeight;
  //     const width = (item['bbox'][2] - item['bbox'][0]) * frame.offsetWidth;
  //     const height = (item['bbox'][3] - item['bbox'][1]) * frame.offsetHeight

  //     // Draw the bounding box.
  //     ctx.strokeStyle = "#00FFFF";
  //     ctx.lineWidth = 4;
  //     ctx.strokeRect(x, y, width, height);
  //     // ctx.strokeRect(0, 0, 1920, 700);
  //     // Draw the label background.
  //     ctx.fillStyle = "#00FFFF";
  //     const textWidth = ctx.measureText(item["label"] + " " + (100 * item["score"]).toFixed(2) + "%").width;
  //     const textHeight = parseInt(font, 10); // base 10
  //     ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
  //   });

  //   detections.forEach(item => {
  //     if (item["label" === 'No_Helmet']) {

  //     }
  //     const x = item['bbox'][0] * frame.offsetWidth;
  //     const y = item['bbox'][1] * frame.offsetHeight;

  //     // Draw the text last to ensure it's on top.
  //     ctx.fillStyle = "#000000";
  //     ctx.fillText(item["label"] + " " + (100 * item["score"]).toFixed(2) + "%", x, y);
  //   });
  //   setIsDetect(true)
  //   setDetectData(detections)
  // }