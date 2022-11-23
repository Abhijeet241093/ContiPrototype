/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { Modal, Input, Tooltip, Button, message, Form, DatePicker } from 'antd';
import _ from 'lodash'
import { CopyFilled, DownloadOutlined } from '@ant-design/icons';
import { appStore } from '../../store/App.store';
import { ethers, utils, BigNumber } from 'ethers'
import { useNavigate, useHref } from "react-router-dom";
import { requestCA } from '../../functions/General.function';
const { RangePicker } = DatePicker;
export default function ModalAddProject({ setClose, tokenId }) {
  const navigate = useNavigate();
  const { setIsLoading ,isLoading} = appStore()
  const [form] = Form.useForm();
  const close = () => {
    setClose(false)
  }

  const handleOk = (e) => {
    form.validateFields()
      .then(async values => {
        console.log(values)
        setIsLoading(true)
        let data = await requestCA('post', '/api/project', { ...values }, null)
        if (data) {
          navigate(0)
        }
        setIsLoading(false)
      })
      .catch(ex => {
        setIsLoading(false)
      })

  };
  return (
    <React.Fragment>
      <Modal
        title={`Add project`}
        visible={true}
        onOk={handleOk}
        onCancel={close}
        forceRender={true}
        // bodyStyle={{ padding: 5 }}
        closable={false}
      >

        <Form form={form} loading={isLoading}   >
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
              placeholder="Project Name"
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
              style={{width:'100%'}}
            />
          </Form.Item>

        </Form>
      </Modal>
    </React.Fragment>
  );
}

