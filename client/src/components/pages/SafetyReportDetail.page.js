import React, { useEffect, useState,useRef } from "react";
import { Result, Button, message } from 'antd';
import { useNavigate, useSearchParams } from "react-router-dom";
import Camera from "../camera/Camera";
import { appStore } from "../../store/App.store";
import { getCurrentPosition, requestCA } from "../../functions/General.function";
import moment from "moment";

function SafetyReportDetailPage(props) {
    const navigate = useNavigate()
    const [isCheckCamera, setIsCheckCamera] = useState()
    const [search, setSearch] = useSearchParams();
    const { captureImage, setCaptureImage, setIsLoading } = appStore()
    const projectId = search.get('projectId')
    const safetyReportId = search.get('safetyReportId')
    const ref = useRef()
    const refImg = useRef()
    useEffect(() => {
        if (refImg.current && ref.current)
            run()
    }, [ref, refImg])
    const run = async () => {
        setIsLoading(true)
        let data = await requestCA('get', '/api/safetyReport', null, { id: safetyReportId })
        if (data) {
            let key = `chungangPrototype/${projectId}/safety/${data.data.id}.jpg`
            let url = await requestCA('get', '/api/s3/get-link', null, { key })
            let img = new Image()
            refImg.current.onload = async function () {
                let frame = document.getElementById('task-image')
                img.width = frame.width
                img.height = frame.height
                ref.current.width = frame.width
                ref.current.height = frame.height
                drawBox(data.data.detectData)
            }
            refImg.current.src = url.data
        }
        setIsLoading(false)
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
    }
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', flexDirection: 'column', padding: 5, backgroundImage: 'url(https://i.postimg.cc/8zt2YPhf/Backpage.png)'}} >
            <div>
                <h2>Safety Report</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }} >
                <div style={{ width: '100%', aspectRatio: '2/1' }} >
                    <div style={{ height: '100%', width: '100%', position: 'relative' }} >
                        <img id="task-image" ref={refImg} style={{ position: 'absolute', width: '100%', height: '100%' }}

                        />
                        <canvas style={{ position: 'absolute', width: '100%', height: '100%' }} ref={ref}

                        />
                    </div>
                </div>

                {/* <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
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
                            <span>Lng:</span>
                        </div>
                        <div style={{ width: '50%', color: 'gray' }}>
                            <span>{`position?.lng`}</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 5, fontSize: 20, fontWeight: 'bolder', justifyContent: 'space-evenly' }}>
                        <div style={{ width: '50%' }}>
                            <span>Lat:</span>
                        </div>
                        <div style={{ width: '50%', color: 'gray' }}>
                            <span>{`position?.lat`}</span>
                        </div>
                    </div>

                </div> */}

            </div>
        </div>

    );
}

export default (SafetyReportDetailPage);
