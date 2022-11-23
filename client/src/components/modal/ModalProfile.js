/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { Modal, Input, Tooltip, Button, message, Form, DatePicker, Select } from 'antd';
import _ from 'lodash'
import { CopyFilled, DownloadOutlined } from '@ant-design/icons';
import { appStore } from '../../store/App.store';
import { ethers, utils, BigNumber } from 'ethers'
import { useNavigate, useHref } from "react-router-dom";
import { requestCA } from '../../functions/General.function';
const { RangePicker } = DatePicker;
export default function ModalProfile({ setClose, tokenId }) {
  const navigate = useNavigate();
  const { setIsLoading, isLoading } = appStore()
  const [isExtend, setIsExtend] = useState()
  const [walletAddress, setWalletAddress] = useState()
  const [form] = Form.useForm();
  const close = () => {
    setClose(false)
  }
  useEffect(() => {
    run()
  }, [])
  const run = async () => {
    let data = await requestCA('get', '/api/user')
    console.log(data)
    if (data) {
      form.setFieldsValue({ userName: data.data.userName, role: data.data.role, title: data.data.title , walletAddress: data.data.walletAddress})
      setIsExtend(data.data.role === 'Worker')
      setWalletAddress(data.data.walletAddress)
    }
  }

  const handleOk = (e) => {
    form.validateFields()
      .then(async values => {
        console.log(values)
        setIsLoading(true)
        let data = await requestCA('put', '/api/user', { ...values })
        if (data) {
          navigate(0)
        }
        setIsLoading(false)
      })
      .catch(ex => {
        setIsLoading(false)
      })

  };
  const onFormLayoutChange = (e, allValues) => {
    setIsExtend(allValues.role === 'Worker');
    setWalletAddress(allValues.walletAddress)
  };
  return (
    <React.Fragment>
      <Modal
        title={`Profile`}
        visible={true}
        onOk={handleOk}
        onCancel={close}
        forceRender={true}
        // bodyStyle={{ padding: 5 }}
        closable={false}

      >

        <Form form={form} loading={isLoading} autoComplete={false} layout='vertical'
          onValuesChange={onFormLayoutChange}
        >
          <Form.Item
            name='userName'
            label='User name'
            rules={[
              {
                required: true,
                message: 'Please input user name!',
              },
            ]}
          >
            <Input
              className='bq-input'
              name="userName"
              placeholder="User Name"
              size='large'
            />
          </Form.Item>
          <Form.Item
            name='role'
            label='Role'
            rules={[
              {
                required: true,
                message: 'Please input your role!',
              },
            ]}
          >
            <Select
              className='bq-input'
              name='role'
              placeholder='Role' size='large'
              disabled
            >
              <Select.Option value="Worker">Worker</Select.Option>
              <Select.Option value="Contractor">Contractor</Select.Option>
              <Select.Option value="Owner">Owner</Select.Option>
            </Select>
          </Form.Item>

          {isExtend &&

            <Form.Item
              name='title'
              rules={[
                {
                  required: true,
                  message: 'Please input your title!',
                },
              ]}
            >
              <Select
                className='bq-input'
                name='title'
                placeholder='Title'
                size='large'
              >
                <Select.Option value="Electrician">Electrician</Select.Option>
                <Select.Option value="Mason">Mason</Select.Option>
                <Select.Option value="Welder">Welder</Select.Option>
              </Select>
            </Form.Item>
          }

          <Form.Item
            name='walletAddress'
            label='Wallet Address'
            rules={[
              {
                required: true,
                message: 'Please input user name!',
              },
            ]}
          >
            <Input
              addonBefore={
                walletAddress && <img src={`https://api.multiavatar.com/${walletAddress}.png`} width={20} />
              }
              className='bq-input'
              name="walletAddress"
              placeholder='Wallet Address'
              size='large'
            />
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  );
}

