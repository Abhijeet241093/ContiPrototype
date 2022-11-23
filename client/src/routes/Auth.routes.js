import React, { useEffect, useRef, useState } from 'react';
import { Route, Routes, useNavigate, Outlet } from "react-router-dom";
import { appStore } from '../store/App.store';
import decode from 'jwt-decode';
import { requestCA, resetAll } from '../functions/General.function';
import TopNavigation from '../components/navigation/TopNavigation';

export default function AuthRoute(props) {
    const { setIsLoading, setUser, user ,setPageName ,resetAppStore } = appStore()
    const navigate = useNavigate()
    useEffect(() => {
        setPageName('')
        if (localStorage.caPrototype) {
            run()
        } else {
            navigate('/')
        }
    }, [])
    useEffect(() => {

    }, [])
    const run = async () => {
        setIsLoading(true)
        let data = await requestCA('get', '/api/user')
        if (data) {
            setUser(data.data)
        }
        else {
            resetAll(resetAppStore)
            navigate('/')
        }
        setIsLoading(false)
    }
    return (
        <React.Fragment>
            {user &&
          <React.Fragment>
                    <div style={{ width: '100%', height: '45px', boxShadow: '0 0 8px 0 gray' }} >
                        <TopNavigation />
                    </div>
                    <div style={{ height: 'calc(100% - 45px)', width: '100%', overflow:'auto', padding:5 }}>
                    <Outlet />

                    </div>
                </React.Fragment>

            }
        </React.Fragment>
    )
}