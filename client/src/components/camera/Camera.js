import React, { useEffect, useRef, useState } from "react";
import { Result, Button, message } from 'antd';
import { useNavigate } from "react-router-dom";
import { appStore } from "../../store/App.store";
import { userMediaAvailable } from "../../functions/General.function";
import { cameraSetting } from "../../constant/cameraSetting";



function Camera(props) {
    const ref = useRef()
    const navigate = useNavigate()
    const { setCaptureImage } = appStore()
    const [isDone, setIsDone] = useState()
    useEffect(() => {
        if (ref.current) {
            if (userMediaAvailable) {
                navigator.mediaDevices.getUserMedia(cameraSetting)
                .then((stream) => {
                    ref.current.srcObject = stream;
                    ref.current.play()
                    setIsDone(true)
                })
                .catch(err=>{
                    message.warning(err.message)
                    console.log(err)
                })
            } else {
                message.warning('You cannot access camera')
            }
        }

    }, [ref.current])
  
    const handleTakePicture = () => {
        const canvas = document.createElement('canvas')
        canvas.width = ref.current.videoWidth;
        canvas.height = ref.current.videoHeight;
        canvas.getContext('2d').drawImage(ref.current, 0, 0);
        setCaptureImage(canvas.toDataURL('image/jpeg'))
    }
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: 'calc(100% - 0px)', }} >
                <video style={{ width: '100%', height: '100%' }} ref={ref}  ></video>

                {isDone && <div style={{ position: 'fixed', width: '100%', bottom: 50, textAlignLast: 'center' , padding:5 }} >
                <Button className="bq-custom-button large block" onClick={handleTakePicture}  > CAPTURE</Button>
                </div>}
            </div>
        </>

    )
}

export default (Camera);
