import React, { useEffect, useState } from "react";
import { Result, Button, message, Segmented } from 'antd';
import { useNavigate, useSearchParams } from "react-router-dom";
import { requestCA } from "../../functions/General.function";
import { appStore } from "../../store/App.store";
import _ from "lodash";
import { statusType } from "../../constant/statusType";
import TaskCard from "../card/Task.card";
import moment from "moment";

const dummy = [
  { name: 'User 1', toDO: '', status: '' },
  { name: 'User 2', toDO: '', status: '' },
]

function TasksPage(props) {
  const navigate = useNavigate()
  const [search, setSearch] = useSearchParams();
  const [tasks, setTasks] = useState([])
  const [tasksPending, setTasksPending] = useState([])
  const [tasksArchived, setTasksArchived] = useState([])
  const [tasksExpired, setTasksExpired] = useState([])
  const { user, setIsLoading, contractInterface } = appStore()
  const projectId = search.get('projectId')
  const [key, setKey] = useState('Active')
  useEffect(() => {
    run()
  }, [])
  const run = async () => {
    setIsLoading(true)

    let tx = await contractInterface.taskManagerContract.getTasksByProjectId(projectId)
    let tx1 = await contractInterface.taskManagerContract.getItemInfor(tx)

    let users = []
    let tasks = []
    _.forEach(tx1, (v, k) => {
      users.push(v[5])
      tasks.push(v[2])
    })

    let data1 = await requestCA('get', '/api/activity/getByRange', null, { ids: tasks, projectId })
    tasks = []
    if (!data1) {
      return
    }
    _.forEach(data1.data, v => {
      tasks[v.id] = v
    })

    let data = await requestCA('get', '/api/user/getUsers', null, { users })
    users = []
    _.forEach(data.data, v => {
      users[v.id] = v
    })
    let temp = {
      'inprocess': [],
      'pending': [],
      'success': [],
      'expire': []
    }


    _.forEach(tx1, (v, k) => {
      let name = users[v[5]] ? users[v[5]].userName : 'N/A'
      let status = v.status
      let time = JSON.parse(v[4])
      let end = moment(time[1])
      if (moment().isAfter(end))
        status = 'expire'
      let data = {
        name,
        id: tx[k].toString(),
        taskSubject: v[6],
        activity: tasks[v[2]].name,
        instructor: v.instructor,
        worker: v.worker
        // status: 0//tasks[v[2]] ? tasks[v[2]] : 0,
      }
      if (user.role == 'Admin') {
        temp[status].push(data)
      } else if (v.worker === user.id || v.instructor === user.id) {
        temp[status].push(data)
      }
    })
    console.log(temp)
    setTasks(temp['inprocess'])
    setTasksPending(temp['pending'])
    setTasksArchived(temp['success'])
    setTasksExpired(temp.expire)
    setIsLoading(false)
  }
  const handleTask = (e) => {
    console.log(e)
    if (e.worker === user.id)
      navigate(`/task-info?projectId=${projectId}&taskId=${e.id}`)
    else
      navigate(`/task-management?projectId=${projectId}&taskId=${e.id}`)
  }
  const handlePendingTask = (e) => {
    navigate(`/task-management?projectId=${projectId}&taskId=${e.id}`)
  }
  const handleArchiveTask = (e) => {
    navigate(`/task-management?projectId=${projectId}&taskId=${e.id}`)
  }
  const handleChange = (e) => {
    setKey(e)
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: 5, gap: 5, backgroundImage: 'url(https://i.postimg.cc/8zt2YPhf/Backpage.png)'}} >
      <Segmented block options={[`Active`, `Pending`, `Archived`,'Expired']} size='large' onChange={handleChange} />
      {key == 'Active' && tasks.map(i =>
        <TaskCard item={i} handleNavigate={handleTask} type='active' />
      )}
      {key == 'Pending' && tasksPending.map(i =>
        <TaskCard item={i} handleNavigate={handlePendingTask} type='pending' />
      )}
      {key == 'Archived' && tasksArchived.map(i =>
        <TaskCard item={i} handleNavigate={handleArchiveTask} type='archived' />
      )}
      {key == 'Expired' && tasksExpired.map(i =>
        <TaskCard item={i} handleNavigate={handleArchiveTask} type='expired' />
      )}
    </div>

  );
}

export default (TasksPage);
