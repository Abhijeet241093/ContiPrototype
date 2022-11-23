import React, { useEffect, useRef, useState } from 'react';
import { Route, Routes, useNavigate, Outlet } from "react-router-dom";
import { appStore } from '../store/App.store';
import decode from 'jwt-decode';
import { requestCA, resetAll } from '../functions/General.function';

export default function LoginRoute(props) {
    const navigate = useNavigate()
    useEffect(() => {
        if (localStorage.caPrototype) {
            navigate('/dashboard')
        } 
    }, [])

    return (
        <React.Fragment>
            <Outlet />
        </React.Fragment>
    )
}