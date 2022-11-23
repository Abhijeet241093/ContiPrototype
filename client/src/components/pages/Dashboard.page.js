import React, { useEffect, useState } from "react";
import { Result, Button, Segmented } from 'antd';
import { useNavigate } from "react-router-dom";
import ModalAddProject from "../modal/ModalAddProject";
import { appStore } from "../../store/App.store";
import { requestCA } from "../../functions/General.function";
import { FileDoneOutlined, DeleteFilled, PlusCircleOutlined } from "@ant-design/icons";
import logo from '../../image/contil.png'
import moment from 'moment'
import ModalProjectRequest from "../modal/ModalProjectRequest";

function DashboardPage(props) {
  const navigate = useNavigate()
  const { setIsLoading, isLoading, user } = appStore()
  const [isNewProject, setIsNewProject] = useState()
  const [isRequestProject, setIsRequestProject] = useState()
  const [projects, setProject] = useState([])
  const [requestProjects, setRequestProject] = useState([])
  const [key, setKey] = useState('Projects')
  useEffect(() => {
    if (user.role == 'Admin' || user.role === 'Contractor')
      run()
    else {
      runNormalUser()
    }
  }, [])
  const run = async () => {
    setIsLoading(true)
    let data = await requestCA('get', '/api/project/getAll')
    if (data) {
      setProject(data.data)
    }
    setIsLoading(false)
  }
  const runNormalUser = async () => {
    setIsLoading(true)
    let data1 = await requestCA('get', '/api/projectRequest/getByUserId', null, { userId: user.id })
    if (data1) {
      setRequestProject(data1.data)
    }
    let data = await requestCA('get', '/api/project/getByUserId', null, { userId: user.id })
    if (data) {
      setProject(data.data)
    }
    setIsLoading(false)
  }
  const handleProject = (i) => {
    navigate(`/project?projectId=${i.id}`)
  }
  const handleAddProject = () => {
    setIsNewProject(true)
  }
  const handleRequestProject = () => {
    setIsRequestProject(true)
  }
  const handleChange = (e) => {
    console.log(e)
    setKey(e)
  }
  return (
    <React.Fragment>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 10, flexDirection: 'column', justifyContent: 'center', padding: 15, height: '100%', backgroundImage: 'url(https://i.postimg.cc/8zt2YPhf/Backpage.png)' }} >
        {(user.role == 'Admin' || user.role === 'Contractor') ? 
        <Segmented block options={['PROJECTS']} size='large' onChange={handleChange} />
        :
        <Segmented block options={['Projects', 'Requests']} size='large' onChange={handleChange} />
        }
        {key === 'Projects' ?
          projects.map(i =>
            <div className="bq-card"
              onClick={handleProject.bind(this, i)}>
              <div style={{ display: 'flex', padding: 5, alignItems: 'center', height: '100%', }} >
                <div style={{ marginRight: 5 }} >
                  <img height={100} src={logo} />
                </div>
                <div style={{ display: 'flex', height: '100%', width: '100%', flexDirection: 'column', justifyContent: 'space-around' }} >
                  <div>
                    <span style={{ fontWeight: 'bold', fontSize: 20 }}  >{i.name}</span>
                  </div>
                  <div>
                    {i?.duration &&
                      <span style={{ fontSize: 20 }}>{`${moment(i.duration[0]).format('DD/MM/YYYY')} -  ${moment(i.duration[0]).format('DD/MM/YYYY')}`}</span>
                    }
                  </div>
                </div>
              </div>
            </div>
          )
          :
          requestProjects.map(i =>
            <div style={{ background: '#2F80ED', borderRadius: 5, overflow: 'hidden', margin: '5px 5px 15px 5px', boxShadow: '0 0 7px 2px gray', }}>
              <div style={{ display: 'flex', padding: 5, alignItems: 'center', height: '100%', gap: 10 }} >

                <div style={{ display: 'flex', height: '100%', width: '100%', flexDirection: 'column', justifyContent: 'space-around' }} >
                  <div>
                    <span style={{ fontWeight: 'bold' }}  > {`Project Name: ${i.projectName}`}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 'bold' }}  > {`Activity: ${i.activityName}`}</span>
                    {/* {i?.duration &&
                      <span>{`${moment(i.duration[0]).format('DD/MM/YYYY')} -  ${moment(i.duration[0]).format('DD/MM/YYYY')}`}</span>
                    } */}
                  </div>
                </div>
                <div  >
                  <Button type="danger" icon={
                    <DeleteFilled />
                  }  ></Button>
                </div>
              </div>
            </div>
          )
        }

      </div>
      {user
        && (
          <div style={{ position: 'fixed', right: 50, bottom: 50 }} >
           {(user.role == 'Admin' || user.role === 'Contractor') ? <Button style={{ width: 50, height: 50 }} className='bq-custom-button circle large' icon={
              <PlusCircleOutlined style={{ fontSize: 35 }} />
            } onClick={handleAddProject}  ></Button>
              :
             user.role === 'Worker' && <Button style={{ width: 50, height: 50 }} className='bq-custom-button circle large' icon={
                <FileDoneOutlined style={{ fontSize: 35 }} />
              } onClick={handleRequestProject}  ></Button>
            }
          </div>
        )
      }
      {isNewProject && <ModalAddProject setClose={setIsNewProject} />}
      {isRequestProject && <ModalProjectRequest setClose={setIsRequestProject} />}

    </React.Fragment>


  );
}

export default (DashboardPage);
