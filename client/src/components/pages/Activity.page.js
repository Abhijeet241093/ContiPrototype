import React, { useEffect, useState } from "react";
import { Select, Button, message, Timeline } from 'antd';
import { useNavigate, useSearchParams } from "react-router-dom";
import { CaretDownFilled, CaretUpFilled, DeleteFilled, PlusCircleOutlined } from "@ant-design/icons";
import ModalProjectRequest from "../modal/ModalAddActivity";
import { requestCA } from "../../functions/General.function";
import { appStore } from "../../store/App.store";
import { detectType } from "../../constant/detectType";
import _ from "lodash";


const { Option } = Select;
function ActivityPage(props) {
  const [search, setSearch] = useSearchParams();
  const navigate = useNavigate()
  const [activities, setActivities] = useState([])
  const [isNewActivity, setIsNewActivity] = useState()
  const { setIsLoading, isLoading, user } = appStore()
  useEffect(() => {
    run()
  }, [])
  const run = async () => {
    setIsLoading(true)
    const projectId = search.get('projectId')
    let data = await requestCA('get', '/api/activity/getByProjectId', null, { id: projectId })
    if (data) {
      _.forEach(data.data, v => {
        let index = _.findIndex(detectType, i => { return i.value == v.detect })
        v.detect = 'N/A'
        if (index >= 0) {
          v.detect = detectType[index].name
        }
        v.isOpen = false
      })
      setActivities(data.data)
    }
    setIsLoading(false)
  }

  const handleAddActivity = () => {
    setIsNewActivity(true)
  }
  const handleDown = (i) => {
    i.isOpen = !i.isOpen
    setActivities([...activities])
  }
  const handleUp = (i) => {
    i.isOpen = !i.isOpen
    setActivities([...activities])
  }
  return (
    <React.Fragment>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: 5, gap: 10, justifyContent: 'center', padding: 15, backgroundImage: 'url(https://i.postimg.cc/8zt2YPhf/Backpage.png)'}} >
        {activities.map(i =>
          <div className="bq-card">
            <div style={{ display: 'flex', padding: 5, flexDirection: 'column', gap: 5, }}>
              <div style={{ display: 'flex', padding: 5, justifyContent: 'space-between', padding: 5, }} >
                <div style={{ display: 'flex', flexDirection: 'column' }}  >
                  <div style={{ display: 'flex', flexWrap: 'wrap' }} >
                    <span style={{ fontSize: '20', fontWeight: 'bolder', width: 100 }} >{`Name: `}</span>
                    <span style={{ fontSize: '20', fontWeight: 'bolder' }} >{`${i.name}`}</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }} >
                    <span style={{ fontSize: '20', fontWeight: 'bolder', width: 100 }} >{`Detection: `}</span>
                    <span style={{ fontSize: '20', fontWeight: 'bolder' }} >{`${i.detect}`}</span>
                  </div>



                </div>
                <div >
                  <Button className="bq-custom-button delete" icon={
                    <DeleteFilled />
                  }  ></Button>
                </div>


              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', gap: 10, border: '1px solid gray', borderRadius: 5, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'column', height: 30, backgroundColor: 'aliceblue', alignItems: 'center', justifyContent: 'space-between', padding: 5 }}>
                  <span>Flows</span>
                  {i.isOpen ?
                    <CaretDownFilled onClick={handleDown.bind(this, i)} />
                    :
                    <CaretUpFilled onClick={handleUp.bind(this, i)} />
                  }


                </div>
                {i.isOpen && <div className="bq-timeline" style={{ padding: 5, }}>
                  <Timeline>
                    {i?.flows?.map(o =>
                      <Timeline.Item>{o}</Timeline.Item>
                    )}
                  </Timeline>
                </div>
                }
              </div>
            </div>




          </div>
        )}

      </div>
      <div style={{ position: 'fixed', right: 50, bottom: 50 }} >
        <Button style={{ width: 50, height: 50 }} className="bq-custom-button large block circle" icon={
          <PlusCircleOutlined style={{ fontSize: 35 }} />
        } onClick={handleAddActivity}  ></Button>
      </div>

      {isNewActivity && <ModalProjectRequest setClose={setIsNewActivity} />}
    </React.Fragment>
  );
}

export default (ActivityPage);
