import React, { useEffect, useRef, useState } from 'react';
import { Route, Routes, useNavigate, Outlet } from "react-router-dom";
import { appStore } from '../store/App.store';
import decode from 'jwt-decode';
import { requestCA, resetAll } from '../functions/General.function';

export default function AdminRoute(props) {
    const navigate = useNavigate()
    const { user } = appStore()
    useEffect(() => {
        if (user.role !== 'Admin' && user.role !== 'Contractor') {
            navigate('/dashboard')
        }
    }, [])

    return (
        <React.Fragment>
            <Outlet />
        </React.Fragment>
    )
}