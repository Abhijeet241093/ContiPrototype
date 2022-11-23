import React, { useEffect, useState } from "react";
import { Result, Button, message } from 'antd';
import { useNavigate, useSearchParams } from "react-router-dom";
import { appStore } from "../../store/App.store";
import logo from '../../image/contil_logo2.png'
import { requestCA } from "../../functions/General.function";

const projects = [1, 2, 3, 4, 5, 6, 7, 42, 42, 2412, 412, 232]
function SafetyReport(props) {
    const navigate = useNavigate()
    const [search, setSearch] = useSearchParams();
    const { user, setIsLoading } = appStore()
    const [items, setItems] = useState([])
    const projectId = search.get('projectId')
    useEffect(() => {
        run()
    }, [])
    const run = async () => {
        setIsLoading(true)
        let data = await requestCA('get', '/api/safetyReport/getByProjectId', null, { projectId })
        if (data) {
            let temp = []
            for (const e in data.data) {
                let key = `chungangPrototype/${projectId}/safety/${data.data[e].id}.jpg`
                let url = await requestCA('get', '/api/s3/get-link', null, { key })
                temp.push({ id: data.data[e].id, url : url.data})
            }
            setItems(temp)
        }
        setIsLoading(false)
    }
    const handleProject = (e) => {
        const projectId = search.get('projectId')
        navigate(`/${'safety-report-detail'}?projectId=${projectId}&safetyReportId=${e.id}`)
    }
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', height: '100%', padding: 5, gap: 5, alignContent:'flex-start',backgroundImage: 'url(https://i.postimg.cc/8zt2YPhf/Backpage.png)' }} >
            {items.map(i =>
                <div key={i.id} className='bq-card' style={{
                  
                    width: 100, height: 100
                }}
                    onClick={handleProject.bind(this, i)}>
                    <div >
                        <img height={100} src={i.url} />
                    </div>


                </div>
            )}

        </div>

    );
}

export default (SafetyReport);
