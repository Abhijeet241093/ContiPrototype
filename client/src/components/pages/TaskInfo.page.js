import React, { useEffect, useState, useRef } from "react";
import { Result, Button, message, Input, Select, DatePicker, Timeline } from 'antd';
import { useNavigate, useSearchParams } from "react-router-dom";
import { appStore } from "../../store/App.store";
import { getCurrentPosition, requestCA } from "../../functions/General.function";
import _, { set } from "lodash";
import { BigNumber } from "ethers";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import moment from "moment";
import { statusType } from "../../constant/statusType";
import { CaretDownFilled } from "@ant-design/icons";
const { RangePicker } = DatePicker;

function TaskInfoPage(props) {
  const navigate = useNavigate()
  const [search, setSearch] = useSearchParams();
  const { user, setIsLoading, contractInterface, } = appStore()
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(null);
  const [lat, setLat] = useState(null);
  const [zoom, setZoom] = useState(15);
  const [mapStyle, setMapStyle] = useState('streets-v11')
  const [data, setData] = useState()
  const taskId = search.get('taskId')
  const projectId = search.get('projectId')
  useEffect(() => {
    if (taskId)
      run()
    else
      navigate(-1)
  }, [])
  const run = async () => {
    try {
      setIsLoading(true)
      let id = BigNumber.from(taskId)
      let tx1 = await contractInterface.taskManagerContract.getItemInfor([id])
      let item = tx1[0]

      let tasks = [item[2]]
      let data1 = await requestCA('get', '/api/activity/getByRange', null, { ids: tasks , projectId })
      tasks = []
      _.forEach(data1.data, v => {
        tasks[v.id] = v
      })
  

      let users = [item[5], item[1]]
      let data = await requestCA('get', '/api/user/getUsers', null, { users },)
      users = []
      _.forEach(data.data, v => {
        users[v.id] = v
      })
      let time = JSON.parse(item[4])
      let start = moment(time[0]).format('DD/MM/YY HH:mm')
      let end = moment(time[1]).format('DD/MM/YY HH:mm')
      setData({
        worker: users[item[5]].userName,
        instructor: users[item[1]].userName,
        duration: `${start} - ${end}`,
        location: JSON.parse(item[3]),
        activity: tasks[item[2]].name,
        task: item[6],
        status:0// item[6] ==='pending tasks[item[2]] ? tasks[item[2]] : 0,
      })
      setIsLoading(false)
    } catch (e) {
      console.log(e)
      setIsLoading(false)
    }
  }



  useEffect(() => {
    if (mapContainer.current && !map.current && data) {
      let location = [_.toNumber(data.location.lng), _.toNumber(data.location.lat)]
      mapboxgl.accessToken = 'pk.eyJ1IjoiYmFvcXV5bGFuIiwiYSI6ImNrNnhzY2I3dTBoMnkzZnM2MWdmcndjbngifQ.gRlKi7Q0R5YLenCHp4PuAQ';
      // eslint-disable-next-line react-hooks/exhaustive-deps
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: `mapbox://styles/mapbox/${mapStyle}`,
        center: location,
        zoom: zoom,
        // pitch: 45,
      });
      map.current.addControl(new mapboxgl.NavigationControl());
      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          // When active the map will receive updates to the device's location as it changes.
          trackUserLocation: true,
          // Draw an arrow next to the location dot to indicate which direction the device is heading.
          showUserHeading: true
        })
      );
      console.log(data.location)
      var marker = new mapboxgl.Marker().setLngLat(location)
        .addTo(map.current)
    }
  }, [mapContainer.current, map.current, data]);

  const handleUploadImage = () => {
    navigate(`/task-picture?projectId=${projectId}&taskId=${taskId}`)
  }

  return (
    <>
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: 5, gap: 5, height: '100%', justifyContent: 'center', backgroundImage: 'url(https://i.postimg.cc/8zt2YPhf/Backpage.png)' }} >
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 5 }}>
          <h2 style={{ fontWeight: 'bold', paddingTop: 15 }} >TASK INFO</h2>
          <div style={{ display: 'flex', gap: 5, fontSize: 20, fontWeight: 'bolder' }}>
            <div style={{ width: 100 }}>
              <span>Worker:</span>
            </div>
            <div style={{ width: 'auto', color: 'gray' }}>
              <span>{data?.worker}</span>
            </div>
          </div>


          <div style={{ display: 'flex', gap: 5, fontSize: 20, fontWeight: 'bolder' }}>
            <div style={{ width: 100 }}>
              <span>Instructor:</span>
            </div>
            <div style={{ width: 'auto', color: 'gray' }}>
              <span>{data?.instructor}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 5, fontSize: 20, fontWeight: 'bolder' }}>
            <div style={{ width: 100 }}>
              <span>Activity:</span>
            </div>
            <div style={{ width: 'auto', color: 'gray' }}>
              <span>{data?.activity}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 5, fontSize: 20, fontWeight: 'bolder' }}>
            <div style={{ width: 100 }}>
              <span>Task:</span>
            </div>
            <div style={{ width: 'auto', color: 'gray' }}>
              <span>{data?.task}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 5, fontSize: 20, fontWeight: 'bolder' }}>
            <div style={{ width: 100 }}>
              <span>Duration:</span>
            </div>
            <div style={{ width: 'auto', color: 'gray' }}>
              <span>{data?.duration}</span>
            </div>
          </div>

          {/* <div style={{ display: 'flex', gap: 5, fontSize: 20, fontWeight: 'bolder', }}>
            <div style={{ width: 100 }}>
              <span>Status:</span>
            </div>
            <div style={{ width: 'auto', color: 'gray' }}>
              <span style={{ color: data?.status === '99' ? 'green' : 'red' }} >{statusType[data?.status] ? statusType[data.status] : 'None'}</span>
            </div>
          </div> */}

          {/* <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', gap: 10, border: '1px solid gray', borderRadius: 5, overflow: 'hidden' , backgroundColor:'white'}}>
            <div style={{ display: 'flex', justifyContent: 'column', height: 30, backgroundColor: 'aliceblue', alignItems: 'center', justifyContent: 'space-between', padding: 5 }}>
              <span style={{fontSize: 20, fontWeight: 'bolder', }} >Flows</span>
              <CaretDownFilled />
            </div>
            <div className="bq-timeline" style={{ padding: 5, }}>
              <Timeline>
                <Timeline.Item>2222</Timeline.Item>
                <Timeline.Item>2222</Timeline.Item>
              </Timeline>
            </div>
          </div> */}


        </div>
        <div style={{ width: '100%', height: '300px' }} >
          <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
        </div>

        <div  >
          <Button className="bq-custom-button large block" onClick={handleUploadImage}  > Upload Image</Button>
        </div>
      </div>


    </>


  );
}

export default (TaskInfoPage);
