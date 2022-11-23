import React, { useEffect, useRef, useState } from 'react';
import { Route, useSearchParams, useNavigate, Outlet } from "react-router-dom";
import { appStore } from '../store/App.store';
import decode from 'jwt-decode';
import { requestCA, resetAll } from '../functions/General.function';
import TopNavigation from '../components/navigation/TopNavigation';
import ModalError from '../components/modal/ModalError';
import { setUpContractInterface } from '../functions/InteractContract.function';
const { ethereum } = window
const validAvalancheChains = ['0XA868', '0XA869', '0XA86A']
export default function BlockchainRoutes(props) {
    const [search, setSearch] = useSearchParams();

    const navigate = useNavigate()
    const { setAccountETHs, setIsCorrectNetwork, accountETHs, isCorrectNetwork,
        setContractInterface, setIsProcess, isProcess, setIsLoading, setUser } = appStore()


    useEffect(() => {
        const setupAccounts = async () => {
            const accounts = await ethereum.request({ method: 'eth_accounts' })
            handleAccount(accounts)
            if (ethereum) {
                ethereum.on('accountsChanged', (accounts) => {
                    window.location.reload()
                    accountsChangedAction(accounts)
                })

                ethereum.on('chainChanged', () => {
                    window.location.reload()
                })
                if (ethereum.chainId) {
                    if (!validAvalancheChains.includes(ethereum.chainId.toUpperCase())) {
                        setIsCorrectNetwork(false)
                    } else {
                        setIsCorrectNetwork(true)
                    }

                }
            }

    
            setIsProcess(false)
            setIsLoading(false)
        }
        setIsLoading(false)
        setUpContractInterface(setContractInterface)
        setupAccounts()
    }, [])
    const accountsChangedAction = async (accounts) => {
        handleAccount(accounts)
    }
    const handleAccount = (accounts) => {
        setAccountETHs(accounts)
    }


    return (
        <React.Fragment>
            {!isProcess &&
                (
                    ((accountETHs.length === 0 || !isCorrectNetwork) ?
                        <ModalError />
                        :
                        <React.Fragment>
                            <Outlet />

                        </React.Fragment>)
                )
            }
        </React.Fragment>
    )
}