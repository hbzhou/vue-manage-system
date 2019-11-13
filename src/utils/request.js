import axios from 'axios';
import { getExpireTime, getRefreshToken, getToken } from './auth';
import { Message } from 'element-ui';


const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 15000,
    responseType: 'json',
    validateStatus(status) {
        return status === 200;
    }
});


const refresh_service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 15000,
    responseType: 'json',
    validateStatus(status) {
        return status === 200;
    }
});


service.interceptors.request.use(
    config => {
        let _config = config;
        try {
            const expireTime = getExpireTime();
            if (expireTime) {
                const left = expireTime - new Date().getTime();
                const refreshToken = getRefreshToken();
                if (left < 5 * 60 * 1000 && refreshToken) {
                    _config = queryRefreshToken(_config);
                } else {
                    if (getToken()) {
                        _config.headers['Authorization'] = 'bearer ' + getToken();
                    }
                }
            }
        } catch (e) {
            console.error(e);
        }
        return _config;
    },
    error => {
        console.log(error);
        return Promise.reject(error);
    }
);

service.interceptors.response.use(
    config => {
        return config;
    },
    error => {
        if (error.response) {
            const errorMsg = error.response.data === null ? 'Internal Error, please contact administrator' : error.response.data;
            switch (error.response.status) {
                case 404:
                    Message({
                        message: 'Resource Not Found' || 'Error',
                        type: ' error',
                        duration: 5 * 1000
                    });
                    break;
                case 403:
                    Message({
                        message: '很抱歉，您暂无该操作权限' || 'Error',
                        type: 'error',
                        duration: 5 * 1000
                    });
                    break;
                case 401:
                    Message({
                        message: '很抱歉，认证已失效，请重新登录' || 'Error',
                        type: 'error',
                        duration: 5 * 1000
                    });
                    break;
                default:
                    if (errorMessage) {
                        Message({
                            message: errorMessage,
                            type: 'error',
                            duration: 5 * 1000
                        });
                    }
                    break;
            }
        }
        return Promise.reject(error);
    }
);

const request = {
    refresh (url, params) {
        params['grant_type'] ='refresh_token'
        return refresh_service.post(url, params, {
            transformRequest:[
                (params) => {
                  return transParams(params)
                }
            ],
            headers:{
                'Authorization':'Basic ZmViczphYmMxMjM='
            }

        })
    },
    login (url, params) {
        params['grant_type'] ='password'
        return refresh_service.post(url, params, {
            transformRequest:[
                (params) => {
                    return transParams(params)
                }
            ],
            headers:{
                'Authorization':'Basic ZmViczphYmMxMjM='
            }

        })
    },
    post(url, params) {
        return service.post(url, params, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    put(url, params) {
        return service.put(url, params, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    get(url, params) {
        let _params
        if (Object.is(params, undefined)) {
            _params = ''
        } else {
            _params = '?'
            for (const key in params) {
                if (params.hasOwnProperty(key) && params[key] !== null) {
                    _params += `${key}=${params[key]}&`
                }
            }
        }
        return service.get(`${url}${_params}`)
    },
    delete(url, params) {
        let _params
        if (Object.is(params, undefined)) {
            _params = ''
        } else {
            _params = '?'
            for (const key in params) {
                if (params.hasOwnProperty(key) && params[key] !== null) {
                    _params += `${key}=${params[key]}&`
                }
            }
        }
        return service.delete(`${url}${_params}`)
    },
    download(url, params, filename) {
        NProgress.start()
        return service.post(url, params, {
            transformRequest: [(params) => {
                return transParams(params)
            }],
            responseType: 'blob'
        }).then((r) => {
            const content = r.data
            const blob = new Blob([content])
            if ('download' in document.createElement('a')) {
                const elink = document.createElement('a')
                elink.download = filename
                elink.style.display = 'none'
                elink.href = URL.createObjectURL(blob)
                document.body.appendChild(elink)
                elink.click()
                URL.revokeObjectURL(elink.href)
                document.body.removeChild(elink)
            } else {
                navigator.msSaveBlob(blob, filename)
            }
            NProgress.done()
        }).catch((r) => {
            console.error(r)
            NProgress.done()
            Message({
                message: '下载失败',
                type: 'error',
                duration: 5 * 1000
            })
        })
    },
    upload(url, params) {
        return service.post(url, params, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }

}



function transParams(params) {
    let result = ''
    Object.keys(params).forEach((key) => {
        if (!Object.is(params[key], undefined) && !Object.is(params[key], null)) {
            result += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&'
        }
    })
    return result
}


async function queryRefreshToken(config, refreshToken) {
    const result = await request.refresh('auth/oauth/token', {
        refresh_token: refreshToken
    })
    if (result.status === 200) {
        saveData(result.data)
        config.headers['Authorization'] = 'bearer ' + getToken()
    }
    return config
}

function saveData(data) {
    store.commit('account/setAccessToken', data.access_token)
    store.commit('account/setRefreshToken', data.refresh_token)
    const current = new Date()
    const expireTime = current.setTime(current.getTime() + 1000 * data.expires_in)
    store.commit('account/setExpireTime', expireTime)
}

export default request
