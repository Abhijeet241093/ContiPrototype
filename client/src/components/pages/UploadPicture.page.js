import React, { useEffect, useRef, useState } from "react";
import { Select, Button, message } from 'antd';
import { useNavigate, useSearchParams } from "react-router-dom";
import Camera from "../camera/Camera";
import { appStore } from "../../store/App.store";
import { getCurrentPosition, requestCA, userMediaAvailable } from "../../functions/General.function";
import moment from "moment";
import axios from "axios";
import { v4 } from 'uuid'
import { ecsApi } from "../../constant/nodeAPI.ecs";
import { detectType } from "../../constant/detectType";
import * as tf from '@tensorflow/tfjs';
import { loadGraphModel } from '@tensorflow/tfjs-converter';
import { cameraSetting } from "../../constant/cameraSetting";
import { geoPosition, initGeo } from "../../functions/Locaiton.function";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

const defaultLocation = [126.9585, 37.5070]
const marker = new mapboxgl.Marker()
const { Option } = Select

let geoTimer

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
  const { captureImage, setCaptureImage, setIsLoading, user } = appStore()
  const [detect, setDetect] = useState()
  const ref = useRef()
  const refImg = useRef()
  const [isDetect, setIsDetect] = useState()
  const [detectData, setDetectData] = useState()

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(null);
  const [lat, setLat] = useState(null);
  const [zoom, setZoom] = useState(15);
  const [mapStyle, setMapStyle] = useState('streets-v11')

  const projectId = search.get('projectId')
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


  useEffect(() => {
    run()
    return () => {
      setIsDetect(false)
      setDetectData(null)
      setCaptureImage('')
    }
  }, [])
  const run = async () => {
    //   navigator.permissions.query({name:'geolocation'}).then(result=>{
    //     switch(result.state){
    //         case 'denied': {
    //             navigator.permissions.revoke({'name':'geolocation'}).then(resolve=>{
    //                 alert(resolve.state)
    //             })
    //             break;
    //         }
    //         case 'prompt':{
    //             alert("need your permission")
    //             break;
    //         }
    //         default:{
    //             console.log("geolocation permission query: ",result)
    //             break;
    //         }
    //     }
    // }).catch(error=>console.error(error))
    // let pos = await getCurrentPosition()
    // if (pos) {
    //   setPosition(pos)
    // }
    // if (userMediaAvailable) {
    //   setIsCheckCamera(true)
    // }
  }

  function geoSuccess(p) {
    clearTimeout(geoTimer);
    console.log(p)
    message.log(p.coords.latitude)
    // $("#geo-latitude").html(p.coords.latitude);
    // $("#geo-longitude").html(p.coords.longitude);
    // $("#geo-test").button("enable");
    // $("#map-geo").attr("title", p.coords.latitude + ", " + p.coords.longitude);
    // initMapByID("map-geo");
  }

  function geoError() {
    clearTimeout(geoTimer);
    // $("#geo-latitude, #geo-longitude").html("failed");
    // $("#geo-test").button("enable");
  }

  const handleDetect = async () => {
    try {
      if (!detect) return
      if (!ecsApi[detect]) return
      let url = ecsApi[detect]
      setIsLoading(true)


      // let key = `chungangPrototype/${projectId}/safety/${v4()}.jpg`
      let key = `chungangPrototype/temp/${v4()}.jpg`
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
      drawBox(data.data)
      setIsLoading(false)
    } catch (e) {
      message.warning(e.message)
      setIsLoading(false)
    }

  }
  const drawBox = (detections) => {
    let frame = document.getElementById('task-image')
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
    setIsDetect(true)
    setDetectData(detections)
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
  const handleConfirm = async () => {
    try {
      setIsLoading(true)
      let id = v4()
      let key = `chungangPrototype/${projectId}/safety/${id}.jpg`

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
      let clone = {
        projectId,
        id,
        detectData,
        userId: user.id,
      }
      let data = await requestCA('post', '/api/safetyReport', clone)
      if (data) {
        navigate(`/project?projectId=${projectId}`)
      }
      setIsLoading(false)
    } catch {
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
      const run = async ()=>{
        map.current= await initGeo( mapContainer.current, marker, setLng,setLat)
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
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: 30, justifyContent: 'center' }} >
        <div style={{ display: 'flex' }}>
          <h2>Upload Image</h2>
        </div>

      </div>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: 'calc(100% - 40px)', flexDirection: 'column', padding: 5 }} >

        <div style={{ display: !position ? 'flex' : 'none', width: '100%', height: '100%', justifyContent: 'center', flexDirection: 'column' }}>
          <div style={{ width: '100%', height: 'calc(100% - 40px)' }} >
            <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
          </div>
          <p />
          <Button className="bq-custom-button large block" onClick={handleLocation} type="primary">Set Location</Button>
        </div>
        {(position && (isCheckCamera ? (captureImage ?
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }} >
            <div style={{ width: '100%', aspectRatio: '2/1' }} >
              <div style={{ height: '100%', width: '100%', position: 'relative' }} >
                <img id="task-image" ref={refImg} style={{ position: 'absolute', width: '100%', height: '100%' }}

                />
                <canvas style={{ position: 'absolute', width: '100%', height: '100%' }} ref={ref}

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
              <div style={{ display: 'flex', justifyContent: 'space-evenly', gap: 15, flexDirection: 'column' }} >
                <div style={{ display: 'flex', justifyContent: 'space-evenly', gap: 5 }} >
                  {!isDetect ? <Button className="bq-custom-button large block"onClick={handleDetect} type="primary" >Detect</Button>
                    :
                    <Button className="bq-custom-button large block"onClick={handleConfirm} type="primary" >Confirm</Button>
                  }
                  <Button className="bq-custom-button cancel large block"  onClick={() => {
                    setIsDetect(false)
                    setDetectData(null)
                    setCaptureImage('')
                  }} >Cancel</Button>
                </div>
                <p/>
                <Button  className="bq-custom-button large block" onClick={handleReLocation} >
                  Set Location
                </Button>
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
          <Button type='primary' onClick={handleCamera} >
            Turn on camera
          </Button>

        ))}
      </div>
    </>


  );
}

export default (UploadPicturePage);
