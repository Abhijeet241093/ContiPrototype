import React, { useEffect, useState } from "react";
import { Result, Button, message } from 'antd';
import { useNavigate, useSearchParams } from "react-router-dom";
import { appStore } from "../../store/App.store";

const dummy = [
  { name: 'CREATE TASK', id: 'create-task' },
  // { name: 'UPLOAD IMAGE', id: 'upload-picture' },
  // { name: 'SAFETY REPORT', id: 'safety-report' },
]
const dummyWorker = [
  // { name: 'CREATE TASK', id: 'create-task' },
  // { name: 'UPLOAD IMAGE', id: 'upload-picture' },
  { name: 'TASKS', id: 'tasks' },
  // { name: 'SAFETY REPORT', id: 'safety-report' },
]
const admindummy = [
  { name: 'ACTIVITY', id: 'activity' },
  { name: 'USER REQUEST', id: 'request' }
]
function ProjectPage(props) {
  const navigate = useNavigate()
  const [search, setSearch] = useSearchParams();
  const { user } = appStore()

  const handleFeature = (e) => {
    const projectId = search.get('projectId')
    navigate(`/${e.id}?projectId=${projectId}`)
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: 5, gap: 10, justifyContent: 'center', padding: 15, backgroundImage: 'url(https://i.postimg.cc/8zt2YPhf/Backpage.png)'}} >
      {(user?.role === 'Admin' || user?.role === 'Contractor' ) &&dummy.map(i =>
        <div  className="bq-card" 
          onClick={handleFeature.bind(this, i)}
        >
          <div style={{ display: 'flex', padding: 25, alignItems: 'center', height: '100%', justifyContent: 'center' }} >

            <div>
              <span style={{ fontWeight: 'bolder', fontSize: 20 }}  >{i.name}</span>
            </div>
          </div>


        </div>
      )}
      {dummyWorker.map(i =>
        <div  className="bq-card" 
          onClick={handleFeature.bind(this, i)}
        >
          <div style={{ display: 'flex', padding: 25, alignItems: 'center', height: '100%', justifyContent: 'center' }} >

            <div>
              <span style={{ fontWeight: 'bolder', fontSize: 20 }}  >{i.name}</span>
            </div>
          </div>


        </div>
      )}
     {(user?.role === 'Admin' || user?.role === 'Contractor' )  &&
        admindummy.map(i =>
          <div className="bq-card"
            onClick={handleFeature.bind(this, i)}
          >
            <div style={{ display: 'flex', padding: 25, alignItems: 'center', height: '100%', justifyContent: 'center' }} >

              <div>
                <span style={{ fontWeight: 'bolder', fontSize: 20 }}  >{i.name}</span>
              </div>
            </div>


          </div>
        )
      }

    </div>

  );
}

export default (ProjectPage);
