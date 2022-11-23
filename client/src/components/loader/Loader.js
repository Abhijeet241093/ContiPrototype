import React,{ useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { Form, Collapse, Typography } from 'antd';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
const { Panel } = Collapse;
const { Text, Title, Paragraph } = Typography

export default function Loader({ fontSize = 50 }) {

  const ref = useRef()
  useEffect(() => {

  }, []);
 
  return (
    <div style={{ width: '100%', height: '100%', position: 'fixed', zIndex: 10000000 }}>
      <div style={{ width: '100%', height: '100%', position: 'absolute', display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center', backgroundColor: '#99999985' }} >
        <div>
          <Spin  indicator={
            <LoadingOutlined style={{ fontSize: fontSize }} spin color='gray' />
          } />
          <p/>
          <div>
            <span>     Loading...</span>
          </div>
        </div>

      </div>
    </div>

  );
};