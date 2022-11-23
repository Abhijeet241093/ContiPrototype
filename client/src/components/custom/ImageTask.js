import { LoadingOutlined } from "@ant-design/icons";
import { message, Spin, Tooltip } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { requestCA } from "../../functions/General.function";
import { drawBoxHelmet } from "../../functions/Helmet.function.";

export function ImageTask({ url, isImage, name }) {
    const [imgS3, setImg] = useState()
    const [isLoading, setIsLoading] = useState()
    const [search, setSearch] = useSearchParams();
    const taskId = search.get('taskId')
    const projectId = search.get('projectId')
    const ref = useRef()
    const refImg = useRef()
    useEffect(() => {
        if (isImage) {
            run()
        }
    }, [])

    useEffect(() => {
        if (imgS3 && refImg.current && ref.current) {
            runImage()
        }
    }, [imgS3, refImg.current, ref.current])
    const runImage = async () => {
        let img = new Image()
        let data = await requestCA('get', '/api/task/getByTaskId', null, { taskId, projectId, name })
        if (!data) {
            return
        }
        refImg.current.onload = async function () {
            let frame = document.getElementById('task-image')
            img.width = frame.width
            img.height = frame.height
            ref.current.width = frame.width
            ref.current.height = frame.height
            const { detections, isCanConfirm } = drawBoxHelmet(data.data.detectData, frame, ref.current)
        }
        refImg.current.src = imgS3
    }
    const run = async () => {
        setIsLoading(true)
        let data = await requestCA('get', '/api/s3/get-link', null, { key: url })
        // console.log(data1.data)
        setImg(data.data)
        setIsLoading(false)
    }
    return (
        <>
            {isLoading ?
                <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                    <Spin indicator={
                        <LoadingOutlined style={{ fontSize: 30, color: 'white' }} spin />
                    } />
                </div>
                :
                imgS3 ?
                    <div style={{ width: '200px', height: '100%' , position:'relative'}} >
                        <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center' }} >
                            <img id="task-image" width={200} ref={refImg} 
                            />
                            <canvas width={200} style={{ position: 'absolute', }} ref={ref}
                            />
                        </div>
                    </div>
                    :
                    <div style={{ fontSize: 20, fontWeight: 'bold' }} >No Image</div>
            }
        </>



    );
}
