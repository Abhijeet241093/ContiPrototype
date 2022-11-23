import React, { useEffect, useRef, useState } from 'react';
import { Divider, message, Select } from 'antd'
import { useNavigate } from "react-router-dom";
import { Form, Input, Button } from 'antd';
import {
  MailOutlined, LockOutlined
} from '@ant-design/icons';
import { requestCA } from '../../functions/General.function';
import { appStore } from '../../store/App.store';
import {
  UserOutlined
} from '@ant-design/icons';
export default function SignUpForm({ setIsSign }) {
  const [form] = Form.useForm();
  const { setIsLoading, isLoading } = appStore()
  const [isExtend, setIsExtend] = useState()
  const navigate = useNavigate()
  useEffect(() => {

  }, []);

  const onSubmit = (e) => {
    form.validateFields()
      .then(async values => {
        let clone = {...values}
        if(!clone['title']) clone.title=''
        setIsLoading(true)
        let data = await requestCA('post', '/api/auth/signup', { ...clone }, null)
        if (data) {
          localStorage.caPrototype = data.data.token
          navigate('/dashboard')
        }
        setIsLoading(false)
      })
      .catch(ex => {
        setIsLoading(false)
      })

  };
  const onFormLayoutChange = (e,allValues) => {

    setIsExtend(allValues.role === 'Worker');
  };
  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', flexDirection: 'column', justifyContent: 'center', padding: 15, backgroundImage: 'url(https://i.postimg.cc/8zt2YPhf/Backpage.png)' }} >
      <h1 style={{ fontWeight: 'bold' }} >SIGN UP</h1>
      <Form form={form} loading={isLoading} onFinish={onSubmit} onValuesChange={onFormLayoutChange} >
        <Form.Item
          name='email'
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
          ]}
        >
          <Input
                className='bq-input'
            prefix={<MailOutlined />}
            name="email"
            autoComplete={false}
            placeholder="Email"
            size='large'
          />
        </Form.Item>

        <Form.Item hasFeedback
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password
                className='bq-input'
            visibilityToggle={false}
            prefix={<LockOutlined />}
            autoComplete={false}
            placeholder="Password"
            size='large'

          />
        </Form.Item>


        <Form.Item
          name="confirm"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The password did not match!'));
              },
            }),
          ]}
        >
          <Input.Password
                       className='bq-input'
            placeholder='Confirm Password' visibilityToggle={false} size='large'
            prefix={<LockOutlined />} />
        </Form.Item>

        <Form.Item
          name='userName'
          rules={[
            {
              required: true,
              message: 'Please input your name!',
            },
          ]}
        >
          <Input
                       className='bq-input'
            prefix={<UserOutlined />}
            name="userName"
            autoComplete={false}
            placeholder="User Name"
            size='large'
          />
        </Form.Item>


        <Form.Item
          name='role'
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
          >
            <Select.Option value="Worker">Worker</Select.Option>
            {/* <Select.Option value="Contractor">Contractor</Select.Option>
            <Select.Option value="Owner">Owner</Select.Option> */}
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




        <Button className='bq-custom-button large block'  htmlType="button"  loading={isLoading} size='large' 
          onClick={onSubmit}
        >Sign up</Button>
        <br />
        <p />
        <div style={{ display: 'flex', justifyContent: 'center' }} >
          <span >
            <a onClick={() => { navigate('/') }} >Login</a> if you have an account
            {/* <a to="/"> return Home</a><br /> */}
            {/* <Link to="/forgot_password">Forgot Password?</Link> */}
          </span>
        </div>
      </Form>
    </div>

  );
};