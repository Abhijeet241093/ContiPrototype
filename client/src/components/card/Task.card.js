import React, { useEffect, useState } from "react";
import { Result, Button, message } from 'antd';
import { useNavigate, useSearchParams } from "react-router-dom";
import { requestCA } from "../../functions/General.function";
import { appStore } from "../../store/App.store";
import _ from "lodash";
import { statusType } from "../../constant/statusType";


function TaskCard({item,handleNavigate}) {
    const navigate = useNavigate()
    const [search, setSearch] = useSearchParams();
    const [tasks, setTasks] = useState([])
    const { user, setIsLoading, contractInterface } = appStore()
    const projectId = search.get('projectId')

    const handleTask = (e) => {
        navigate(`/task-info?projectId=${projectId}&taskId=${e.id}`)
    }

    return (
        <div className="bq-card"
            onClick={handleNavigate.bind(this, item)}
        >
            <div style={{ display: 'flex', padding: 5, height: '100%', flexDirection: 'column', }} >
                <div style={{ display: 'flex', gap: 5, fontSize: 20, fontWeight: 'bolder' }}>
                    <div style={{ width: 100 }}>
                        <span>Name:</span>
                    </div>
                    <div style={{ width: 'auto', color: 'gray' }}>
                        <span>{item?.name}</span>
                    </div>
                </div>


                <div style={{ display: 'flex', gap: 5, fontSize: 20, fontWeight: 'bolder' }}>
                    <div style={{ width: 100 }}>
                        <span>Activity:</span>
                    </div>
                    <div style={{ width: 'auto', color: 'gray' }}>
                        <span>{item.activity}</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 5, fontSize: 20, fontWeight: 'bolder' }}>
                    <div style={{ width: 100 }}>
                        <span>Toto:</span>
                    </div>
                    <div style={{ width: 'auto', color: 'gray' }}>
                        <span>{item.taskSubject}</span>
                    </div>
                </div>

                {/* <div style={{ display: 'flex', gap: 5, fontSize: 20, fontWeight: 'bolder' }}>
                    <div style={{ width: 100 }}>
                        <span>Status:</span>
                    </div>
                    <div style={{ width: 'auto', color: 'gray' }}>
                        <span style={{ color: item?.status === '99' ? 'green' : 'red' }} >{statusType[item?.status] ? statusType[item.status] : 'None'}</span>
                    </div>
                </div> */}
            </div>

        </div>
    );
}

export default (TaskCard);
