import React from "react";
import create from 'zustand'


const initialState = {
    user: null,
    isLoginFail: false,
    accountETHs: [],
    isCorrectNetwork: null,
    contractInterface: null,
    isLoading: false,
    isProcess: true,
    project:null,
    pageName:'',
    captureImage:'',
}
export const appStore = create((set) => ({
    ...initialState,
    setCaptureImage: (value) => set((state) => ({ captureImage: value })),
    setUser: (value) => set((state) => ({ user: value })),
    setProject: (value) => set((state) => ({ project: value })),
    setPageName: (value) => set((state) => ({ pageName: value })),
    setIsLoginFail: (value) => set((state) => ({ isLoginFail: value })),
    setAccountETHs: (value = []) => set((state) => ({ accountETHs: value })),
    setIsCorrectNetwork: (value) => set((state) => ({ isCorrectNetwork: value })),
    setContractInterface: (value) => set((state) => ({ contractInterface: value })),
    setIsLoading: (value) => set((state) => ({ isLoading: value })),
    setIsProcess: (value) => set((state) => ({ isProcess: value })),
    resetAppStore: () => set(initialState)
}))