import React, { useEffect, useState } from "react";
import { Result, Button, message } from 'antd';
import { useNavigate, useSearchParams } from "react-router-dom";
import { requestCA } from "../../functions/General.function";
import { appStore } from "../../store/App.store";

const dummy = [
  { name: 'User 1', role: '', activity: '' },
  { name: 'User 2', role: '', activity: '' },

]
function RequestProjectPage(props) {
  const navigate = useNavigate()
  const [search, setSearch] = useSearchParams();
  const [users, setUsers] = useState([])
  const { setIsLoading } = appStore()
  useEffect(() => {
    run()
  }, [])
  const run = async () => {
    setIsLoading(true)
    const projectId = search.get('projectId')
    let data = await requestCA('get', '/api/projectRequest/getByProjectId', null, { id: projectId })
    if (data) {
      setUsers(data.data)
    }
    setIsLoading(false)
  }

  const handleApprove = async (i) => {
    setIsLoading(true)
    let data = await requestCA('post', '/api/projectRequest/approve', i, null)
    if (data) {
      navigate(0)
    }
    setIsLoading(false)
  }

  const handleReject = async (i) => {
    setIsLoading(true)
    let data = await requestCA('post', '/api/projectRequest/reject', i, null)
    if (data) {
      navigate(0)
    }
    setIsLoading(false)
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: 5, gap: 5, justifyContent: 'center', backgroundImage: 'url(https://i.postimg.cc/8zt2YPhf/Backpage.png)'}} >
      {users.map(i =>
        <div style={{ background: 'white', borderRadius: 5, overflow: 'hidden', margin: '5px 5px 15px 5px', boxShadow: '0 0 7px 2px gray', }}>
          <div style={{ display: 'flex', padding: 5, height: '100%', flexDirection: 'column', }} >
            <div style={{ display: 'flex', gap: 5, fontSize: 20, fontWeight: 'bolder' }}>
              <div style={{ width: 100 }}>
                <span>Name:</span>
              </div>
              <div style={{ width: 'auto', color: 'gray' }}>
                <span>{i.userName}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 5, fontSize: 20, fontWeight: 'bolder' }}>
              <div style={{ width: 100 }}>
                <span>Role:</span>
              </div>
              <div style={{ width: 'auto', color: 'gray' }}>
                <span>{i.role}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 5, fontSize: 20, fontWeight: 'bolder' }}>
              <div style={{ width: 100 }}>
                <span>Activity:</span>
              </div>
              <div style={{ width: 'auto', color: 'gray' }}>
                <span>{i.activityName}</span>
              </div>
            </div>

            <p />
            <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', gap:5 }} >
              <div style={{ minWidth: 200 , flexGrow: 1,}}>
                <Button className="bq-custom-button large block"   onClick={handleApprove.bind(this, i)} >Approve</Button>
              </div>
              <div style={{ minWidth: 200 , flexGrow: 1,}}>
                <Button className="bq-custom-button large block close"  onClick={handleReject.bind(this, i)} >Reject</Button>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>

  );
}

export default (RequestProjectPage);
