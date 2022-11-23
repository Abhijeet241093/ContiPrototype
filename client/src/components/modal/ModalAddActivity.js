/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { Modal, Input, Tooltip, Button, message, Form, DatePicker, Select } from 'antd';
import _ from 'lodash'
import { CopyFilled, DeleteOutlined, DownloadOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { appStore } from '../../store/App.store';
import { ethers, utils, BigNumber } from 'ethers'
import { useNavigate, useSearchParams } from "react-router-dom";
import { requestCA } from '../../functions/General.function';
import { detectType } from '../../constant/detectType';
const { RangePicker } = DatePicker;
const { Option } = Select;
export default function ModalAddActivity({ setClose, tokenId }) {
  const navigate = useNavigate();
  const { isLoading, setIsLoading } = appStore()
  const [search, setSearch] = useSearchParams();
  const [form] = Form.useForm();
  const [flows, setFlows] = useState([])
  const close = () => {
    setClose(false)
  }
  useEffect(() => {

  }, [])
  const handleOk = (e) => {
    form.validateFields()
      .then(async values => {
        setIsLoading(true)
        const projectId = search.get('projectId')
        let clone = { ...values }
        clone.projectId = projectId
        clone.flows = flows
        console.log(clone)
        let data = await requestCA('post', '/api/activity', clone, null)
        if (data) {
          navigate(0)
        }
        setIsLoading(false)
      })
      .catch(ex => {
        setIsLoading(false)
      })

  };

  const handleRemoveFlowItem = async (k, e) => {
    if (!window.confirm('Are you want to delete?')) return
    setIsLoading(true)
    // let data = await requestPrefab('delete', `/api/pfSite/deleteFlowByType`, null, { _id: projectId, _type: k },)
    // if (data) {
    //   navigate(0)
    // }
    setIsLoading(false)
  }
  const handleAddNewFlow = (i, e) => {
    let clone = [...flows]
    clone.push('')
    setFlows(clone)
  }
  const handleChangeFlow = (i, e) => {
    let clone = [...flows]
    clone[i] = e.target.value
    setFlows(clone)
  }

  return (
    <React.Fragment>
      <Modal
        title={`Add project`}
        visible={true}
        onOk={handleOk}
        // onCancel={close}
        forceRender={true}
        footer={
          <div style={{ display: 'flex',  }}>
            <Button className='bq-custom-button save block' onClick={handleOk} >Save</Button>
            <Button className='bq-custom-button delete block' onClick={close} >Cancel</Button>
          </div>
        }
        closable={false}
      >

        <Form form={form} loading={isLoading}  >
          <Form.Item
            name='name'
            rules={[
              {
                required: true,
                message: 'Please input project name!',
              },
            ]}
          >
            <Input
              className='bq-input'
              name="name"
              autoComplete={false}
              placeholder="Name"
              size='large'
            />
          </Form.Item>

          <Form.Item
            name='location'
            rules={[
              {
                required: true,
                message: 'Please input location!',
              },
            ]}
          >
            <Input
              className='bq-input'
              name="location"
              autoComplete={false}
              placeholder="Location"
              size='large'
            />
          </Form.Item>


          <Form.Item name="duration"
            rules={[
              {
                required: true,
                message: 'Please input duration!',
              },
            ]}>
            <RangePicker
              className='bq-input'
              name="duration"
              placeholder="Duration"
              size='large'
              style={{ width: '100%' }}
            />
          </Form.Item>


          <Form.Item name="detect"
           >
            <Select className='bq-input' name='detect' placeholder={'Detection Model'} style={{ width: '100%' }} >
              {detectType.map(i =>
                <Option key={i.key} value={i.value}>{i.name}</Option>
              )}

            </Select>
          </Form.Item>
          <div className='bq-custom-tabs'  >
            <div className='header-tabs' >
              <span className='header-text' >
                Flows
              </span>
            </div>

            <div className='body-tabs' >
              {flows?.map((i, k) =>
                <>
                  <div className='row center' >
                    <div className='text-upper full' >
                      <Input className='bq-input' value={i} size={'large'} style={{ width: 'calc(100% - 0px)' }} onChange={handleChangeFlow.bind(this, k)} />
                    </div>
                    <div className='icon' style={{ width: 30 }} >
                      <Button className='bq-custom-button delete block' onClick={handleRemoveFlowItem.bind(this, i)} icon={
                        <DeleteOutlined />
                      } />
                      {/* <DeleteOutlined onClick={handleRemoveFlowItem.bind(this, i)} style={{ color: 'red', fontSize: 18 }} /> */}
                    </div>
                  </div>
                </>
              )}
              <div className='row' >
                <Button block className='bq-custom-button option' onClick={handleAddNewFlow.bind(this)} ghost icon={
                  <PlusCircleOutlined />
                } > Add New Flow </Button>
              </div>
            </div>
          </div>
        </Form>



      </Modal>
    </React.Fragment>
  );
}

