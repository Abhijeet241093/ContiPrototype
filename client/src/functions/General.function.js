import { message } from "antd"
import axios from "axios"
import Compressor from "compressorjs"
import { appStore } from "../store/App.store"
export const requestCA = (method, url, data, params, isUpload = false) => {
    return new Promise(async (resolve, reject) => {
        try {
            let headers = method === 'post' ?
                (isUpload ?
                    {
                        'Authorization': `Bearer ${localStorage.caPrototype}`,
                        "Content-Type": "multipart/form-data",
                    }
                    :
                    {
                        'Authorization': `Bearer ${localStorage.caPrototype}`,
                        'Content-Type': 'application/json'
                    })
                : {
                    'Authorization': `Bearer ${localStorage.caPrototype}`
                }
            let res = await axios({
                method,
                url,
                headers,
                data,
                params
            })
            if (res?.data?.isSuccessful) {
                resolve(res.data)
            } else {
                message.warning(res?.data?.message)
                resolve(null)
            }
        } catch (err) {
            console.log(err)
            message.warning(err?.response?.data?.message)
            resolve(null) 
        }
    })
}
export const compressImage = (image, level = 0.6) => {
    return new Promise(async (resolve, reject) => {
        new Compressor(image, {
            quality: level,
            success: (compressedResult) => {
                resolve(compressedResult)
            },
            error: (err) => {
                console.log(err)
                reject()
            }
        });
    })
}

export function blobToBase64(blob) {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

export const resetAll = (resetAppStore) => {
    localStorage.removeItem('caPrototype')
    resetAppStore()
}

export async function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        try {
            navigator.geolocation.getCurrentPosition((pos) => {
                console.log(pos)
                resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            }, (err) => {
                // message.warning(err.message,err.message)
                console.log(err)
                resolve()
            });
        } catch (err) {
            console.log( err.message)
            // message.warning(err.message,err.message)
            resolve()
        }
    });
}
export const userMediaAvailable = () => {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

export function dataURItoBlob(dataURI, type) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type });
  }