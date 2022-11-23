import React, { useEffect } from 'react';
import { message } from 'antd'
import { useNavigate, useSearchParams } from "react-router-dom";
import { Form, Input, Button } from 'antd';
import {
  MailOutlined, LockOutlined
} from '@ant-design/icons';
import { requestCA } from '../../functions/General.function';
import { appStore } from '../../store/App.store';
export default function LoginForm({ setIsSign }) {
  const { setIsLoading, isLoading } = appStore() 
  const [form] = Form.useForm();
  const navigate = useNavigate()
  useEffect(() => {

  }, []);

  const onSubmit = (e) => {
    form.validateFields()
      .then(async values => {
        setIsLoading(true)
        let data = await requestCA('post', '/api/auth', { email: values.email, password: values.password }, null)
        if (data) {
          localStorage.caPrototype = data.data.token
          navigate('/dashboard')
        }
        setIsLoading(false)
      })
      .catch(ex => {
        setIsLoading(false)
        message.error(ex)
      })
  };

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', flexDirection: 'column', justifyContent: 'center', padding: 15 , backgroundRepeat:'round'
    , backgroundImage: 'url(https://i.postimg.cc/2yh91m0k/Group-1000001259.png)'}} >
      <div style={{ height: '50%', display: 'flex', justifyContent: 'center' }} >
        <h1 style={{ fontWeight: 'bold', paddingTop: 15 }} >I-Safe</h1>
      </div>
      <div style={{ height: '50%', }} >
        <Form form={form} loading={isLoading} onFinish={onSubmit} >
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
            <Input       className='bq-input'
              prefix={<MailOutlined />}
              placeholder="Email"
              size='large'
            />
          </Form.Item>

          <Form.Item hasFeedback
            name='password'
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password       className='bq-input'
              visibilityToggle={false}
              prefix={<LockOutlined />}
              placeholder="Password"
              size='large'
            />
          </Form.Item>


          <Button className='bq-custom-button large block'  htmlType="submit"  loading={isLoading} >Login</Button>

          <br />
          <p />
          <div style={{ display: 'flex', justifyContent: 'center' }} >
            <span >
              <a onClick={() => { navigate('/sign-up') }} >Sign up</a> if you don't have an account
              {/* <a to="/"> return Home</a><br /> */}
              {/* <Link to="/forgot_password">Forgot Password?</Link> */}
            </span>
          </div>

        </Form>

      </div>

    </div>

  );
};