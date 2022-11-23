import React, { useState, useEffect } from 'react';
import { Button, Popover, Typography, Menu } from 'antd';
import {
    UserOutlined, LogoutOutlined, LeftOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from "react-router-dom";
import _ from 'lodash'
import logo from '../../image/contil.png'
import { appStore } from '../../store/App.store';
import ModalProfile from '../modal/ModalProfile';
const { Text } = Typography

function TopNavigation(props) {
    let navigate = useNavigate();
    const location = useLocation();
    const { user, pageName } = appStore();
    const [isCanBack, setIsCanBack] = useState()
    const [isProfile, setIsProfile] = useState()
    const handleLogout = () => {
        localStorage.removeItem('caPrototype')
        navigate('/')
    }
    const handleBack = () => {
        navigate(-1)
    }
    useEffect(() => {
        let index = _.findIndex(['/', '/dashboard'], v => { return v === location.pathname })
        if (index < 0) {
            setIsCanBack(true)
        } else {
            setIsCanBack(false)
        }
    }, [location.pathname])
    const handleProfile = () => {
        setIsProfile(true)
    }
    return (
        <>
            <div style={{ position: 'sticky', top: 0, display: 'flex', justifyContent: 'space-between', zIndex: 10, backgroundColor: '#2f80ed', alignItems: 'center' }} >
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingLeft: 10}} >
                    {/* <Button onClick={handleCollapseSidebar} style={{ marginRight: 5, color: 'black' }} ghost icon={
                    isCollapseSidebar ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                } /> */}
                    {isCanBack &&
                        <Button onClick={handleBack} style={{ marginRight: 5, color: 'black' }} ghost icon={
                            <LeftOutlined width={30} />
                        } />
                    }
                    <div onClick={() => navigate('/')}>
                        < img src={logo} height={40} />
                    </div>


                    <span style={{ fontSize: 20, marginLeft: 10, fontWeight: 'bolder' }} >
                        {pageName}
                    </span>
                </div>
                <div className='prefab-center' >
                    <Popover
                        content={
                            <React.Fragment>
                                <Menu>
                                    <Menu.Item onClick={handleProfile} icon={
                                        <UserOutlined />
                                    } key={user?.email}  >{user?.email}</Menu.Item>
                                    <Menu.Item icon={
                                        <LogoutOutlined />
                                    } onClick={handleLogout} key={'logout'}>Log Out</Menu.Item>

                                </Menu>
                            </React.Fragment>
                        }
                        trigger="click"
                        placement='bottomLeft'
                    >
                        <Button icon={<UserOutlined />} shape="circle" />
                    </Popover>

                </div>
            </div>
         {isProfile&&   <ModalProfile setClose={setIsProfile} />}
        </>

    );
}

export default TopNavigation;
