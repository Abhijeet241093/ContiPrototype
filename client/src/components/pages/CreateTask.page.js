import React, { useEffect, useState, useRef, useMemo } from "react";
import { Result, Button, message, Input, Select, DatePicker } from 'antd';
import { useNavigate, useSearchParams } from "react-router-dom";
import { appStore } from "../../store/App.store";
import { getCurrentPosition, requestCA } from "../../functions/General.function";
import _ from "lodash";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { initGeo } from "../../functions/Locaiton.function";
const { RangePicker } = DatePicker;


const marker = new mapboxgl.Marker()
function CreateTask(props) {
  const navigate = useNavigate()
  const [search, setSearch] = useSearchParams();
  const { user, setIsLoading, contractInterface } = appStore()
  const [activities, setActivities] = useState([])
  const [workers, setWorkers] = useState([])
  const [worker, setWorker] = useState()
  const [activity, setActivity] = useState()
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(null);
  const [lat, setLat] = useState(null);
  const [zoom, setZoom] = useState(15);
  const [mapStyle, setMapStyle] = useState('streets-v11')
  const [duration, setDuration] = useState()
  const [time, setTime] = useState()

  useEffect(() => {
    run()
  }, [])
  const run = async () => {
    try {
      setIsLoading(true)
      const projectId = search.get('projectId')
      let data = await requestCA('get', '/api/workerActivity/getByProjectId', null, { projectId })
      if (data) {
        let values = _.values(data.data)
        setActivities(values)
      }
      setIsLoading(false)
    } catch (e) {
      console.log(e)
      setIsLoading(false)
    }
  }
  const handleChange = (e, d) => {
    setActivity(e)

    let item = _.find(activities, v => { return v.activityId === e })
    console.log(item)
    setWorkers(item.workers)
  }
  const handelWorker = (e) => {
    setWorker(e)
  }

  useEffect(() => {
    if (mapContainer.current && !map.current) {
      const run = async () => {
        map.current = await initGeo(mapContainer.current, marker, setLng, setLat)
      }
      run()
    }
  }, [mapContainer.current, map.current]);

  const handleDuration = (e) => {
    setDuration(e)
  }
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      // setZoom(map.current.getZoom().toFixed(2));
      marker.setLngLat([map.current.getCenter().lng, map.current.getCenter().lat])
    });

  }, [map.current]);
  const handleConfirm = async () => {
    try {

      console.log(activity, worker)
      if (activity && worker) {
        if (lng && lat) {
          setIsLoading(true)
          const projectId = search.get('projectId')
          let activityItem = _.find(activities, v => { return v.activityId === activity })
          let userItem = _.find(workers, v => { return v.userId === worker })
          if (!userItem.walletAddress) {
            message.warning('Worker did not add wallet address')
            return
          }
          console.log(activityItem, userItem)
          console.log(contractInterface)
          let currentStep = activityItem?.flows ? activityItem?.flows[0] : ''
          let tx = await contractInterface.taskManagerContract.createTask(
            projectId, user.id, activityItem.activityId, JSON.stringify({ lat, lng }),
            JSON.stringify(duration), userItem.userId,currentStep,'inprocess', userItem.walletAddress)
          await tx.wait()
          setIsLoading(false)
          navigate(-1)
        }
      }
    }
    catch (err) {
      message.warning(err.message)
      setIsLoading(false)
    }


  }
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: 5, gap: 5, justifyContent: 'center', padding: 15, backgroundImage: 'url(https://i.postimg.cc/8zt2YPhf/Backpage.png)'}} >
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 5, height: 200 }}>
          <h2 style={{ fontWeight: 'bold', paddingTop: 15 }} >CREATE TASK</h2>
          <Select
            className='bq-input'
            name='activityId'
            placeholder='Activity' size='large'
            onChange={handleChange}
            value={activity}
          >
            {activities?.map(v =>
              <Select.Option key={v.activityId} value={v.activityId}>{v.name}</Select.Option>
            )}
          </Select>


          <Select
            className='bq-input'
            name='userId'
            placeholder='Worker' size='large'
            onChange={handelWorker}
            value={worker}
          >
            {workers?.map(v =>
              <Select.Option value={v.userId}>{v.email}</Select.Option>
            )}
          </Select>

          <RangePicker
            className='bq-input'
            name="duration"
            placeholder="Duration"
            size='large'
            style={{ width: '100%' }}
            onChange={handleDuration}
            value={duration}
          />
          <RangePicker
            className='bq-input'
            name="duration"
            placeholder="Duration"
            size='large'
            style={{ width: '100%' }}
            onChange={handleDuration}
            value={duration}
          />

        </div>
        <div style={{ width: '100%', height: 'calc(100% - 200px' }} >
          <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
        </div>

        <div  >
          <Button className="bq-custom-button large block" onClick={handleConfirm}  > CONFIRM</Button>
        </div>
      </div>


    </>


  );
}

export default (CreateTask);
