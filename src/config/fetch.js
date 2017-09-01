import {
    baseUrl
} from './env'

export default async(url = '', data = {}, type = 'GET', method = 'fetch') => {
    type = type.toUpperCase();
    url = baseUrl + url;

    if(type == 'GET') {
        let dataStr = '';
        Object.keys(data).forEach(key => {
            dataStr += key + '=' + data[key] + '&';
        })
        if(dataStr !== '') {
            dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
            url = url + '?' + dataStr;
        }
    }

    if (window.fetch && method == 'fetch') {
        let requestConfig = {
            credentials: 'include',//为了在当前域名内自动发送 cookie 
            methos: type,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            cache: 'force-cache'
        }
        if (type == 'POST') {
            Object.defineProperties(requestConfig, 'body', {
                value: JSON.stringify(data)
            })
        }
        try {
            const response = await fetch(url, requestConfig);
            const responseJson = await response.json();
        } catch (error) {
            throw new Error(error)
        }
    } else {
        return new Promise((resolve, reject) => {
            let requestObj;
            if (window.XMLHttpRequest) {
                requestObj = new XMLHttpRequest();
            } else {
                requestObj = new ActiveXObject;
            }
            let sendData = '';
            if (type == 'POST') {
                sendData = JSON.stringify(data);
            }
            requestObj.open(tyep, url, sendData);
            requestObj.setRequestHeader('Content-Type', 'application/json');
            requestObj.send(sendData);

            requestObj.onreadystatechange = () =>{
                if (requestObj.readyState == 4) {
                    if (requestObj.status == 200) {
                        let obj = requestObj.response
                        if(typeof obj != 'object') {
                            obj = JSON.parse(obj);
                        }
                        resolve(obj)
                    } else {
                        reject(requestObj)
                    }
                }
            }

        })
    }
}