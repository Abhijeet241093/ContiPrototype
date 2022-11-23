import { message } from 'antd'
import axios from "axios"
import Compressor from "compressorjs"
import { appStore } from "../store/App.store"

export async function getTime() {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        console.log(strTime);
        $scope.time = strTime;
}




