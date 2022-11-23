/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { Modal, Input, Tooltip, Button, message, Form, DatePicker, Select } from 'antd';
import _ from 'lodash'
import { CopyFilled, DownloadOutlined } from '@ant-design/icons';
import { appStore } from '../../store/App.store';
import { ethers, utils, BigNumber } from 'ethers'
import { useNavigate, useSearchParams } from "react-router-dom";
import { requestCA } from '../../functions/General.function';
const { RangePicker } = DatePicker;
let projectIdLocal = null
export default function ModalProjectRequest({ setClose, tokenId }) {
  const navigate = useNavigate();
const ref =useRef()
  const { isLoading, setIsLoading, user } = appStore()
  const [form] = Form.useForm();
  const [activities, setActivities] = useState([])
  const [projects, setProject] = useState([])
  const close = () => {
    setClose(false)
  }
  useEffect(() => {
    run()
    return () => {
      projectIdLocal = null
    }
  }, [])
  const run = async () => {
    setIsLoading(true)

    let data1 = await requestCA('get', '/api/project/getAll')
    if (data1) {
      setProject(data1.data)
    }
    setIsLoading(false)
  }
  const handleOk = (e) => {
    if (user) {
      form.validateFields()
        .then(async values => {
          setIsLoading(true)
          // let activity = _.find(activities, i => { return i.id === values.activityId })
          let clone = { ...values }
          // clone.email = user.email
          clone.userId = user.id
          // clone.userName = user.userName
          // clone.role = user.role
          // clone.activityName = activity.name
          let data = await requestCA('post', '/api/projectRequest', clone, null)
          if (data) {
            navigate(0)
          }
          setIsLoading(false)
        })
        .catch(ex => {
          setIsLoading(false)
        })
    }


  };
  const handleValueChange = async (e, values) => {
    try {
      console.log(e,values)
      if (projectIdLocal === null || projectIdLocal !== values.projectId) {
        setIsLoading(true)
        let data = await requestCA('get', '/api/activity/getByProjectId', null, {id: values.projectId})
        if (data) {
          setActivities(data.data)
          projectIdLocal =values.projectId
          ref.current.setFieldsValue({
            activityId: '',
          });
        }
        setIsLoading(false)
      }
    } catch (ex) {
      setIsLoading(false)
    }


  }
  return (
    <React.Fragment>
      <Modal
        title={`Request project`}
        visible={true}
        onOk={handleOk}
        onCancel={close}
        forceRender={true}
        closable={false}
      >

        <Form form={form} ref={ref} loading={isLoading} onValuesChange={handleValueChange}  >
          <Form.Item
            name='projectId'
            rules={[
              {
                required: true,
                message: 'Please input project name!',
              },
            ]}
          >
            <Select   className='bq-input'
              name='projectId'
              placeholder='Project Name' size='large'
            >
              {projects?.map(v =>
                <Select.Option value={v.id}>{v.name}</Select.Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item
            name='activityId'
            rules={[
              {
                required: true,
                message: 'Please input activity name!',
              },
            ]}
          >
            <Select
              className='bq-input'
              name='activityId'
              placeholder='Activity' size='large'
            >
              {activities?.map(v =>
                <Select.Option value={v.id}>{v.name}</Select.Option>
              )}
            </Select>
          </Form.Item>


        </Form>
      </Modal>
    </React.Fragment>
  );
}

