import React, { useEffect, useState } from "react";
import { Result, Button, message } from 'antd';
import { useNavigate } from "react-router-dom";

function NoPage(props) {
    const navigate = useNavigate()

    const handleGoHome = () => {
        navigate('/')
    }
    return (
        <div style={{display:'flex' , justifyContent:'center', alignItems:'center', width:'100%',height:'100%', backgroundImage: 'url(https://i.postimg.cc/8zt2YPhf/Backpage.png)'}} >
            <Result
        //   style={{height:'100%'}} 
                status="error"
                title="404"
                subTitle="Page Not Found."
                extra={[
                    <Button className='bq-custom-button large' key="console" onClick={handleGoHome}>Back Home</Button>,

                ]}
            >

            </Result>

        </div>

    );
}

export default (NoPage);
