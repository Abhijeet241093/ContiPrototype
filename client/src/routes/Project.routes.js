import React, { useEffect, useRef, useState } from 'react';
import { Route, useSearchParams, useNavigate, Outlet } from "react-router-dom";
import { appStore } from '../store/App.store';
import decode from 'jwt-decode';
import { requestCA, resetAll } from '../functions/General.function';
import TopNavigation from '../components/navigation/TopNavigation';

export default function ProjectRoute(props) {
    const [search, setSearch] = useSearchParams();
    const { setIsLoading, setProject, project,setPageName } = appStore()
    const navigate = useNavigate()
    useEffect(() => {
        const projectId = search.get('projectId')
        if (!projectId) {
            navigate('/dashboard')
        } else {
            run()
        }
    }, [])

    const run = async () => {
        const projectId = search.get('projectId')
        setIsLoading(true)
        let data = await requestCA('get', '/api/project',null,{id:projectId })
        if (data) {
            setProject(data.data)
            setPageName(data.data.name)
        }
        else {
            navigate('/dashboard')
        }
        setIsLoading(false)
    }
    return (
        <React.Fragment>
            {project &&
                <React.Fragment>
                    <Outlet />
                </React.Fragment>

            }
        </React.Fragment>
    )
}