import axios from 'axios';
import Vue from 'vue'

const Axios = axios.create({
    baseURL: 'http://localhost:8888',
    timeout: 10000
});

Axios.interceptors.response.use(
    response => response,
    err => {
        console.log(err);
        if (err && err.response) {
            switch (err.response.status) {
                case 400:
                    if(err.response.data.message==='Bad credentials'){
                        err.message = '账号或密码错误';
                    }else if(err.response.data.message==='User is disabled'){
                        err.message = '您已经被禁用';
                    }else{
                        err.message = '请求出错';
                    }
                    break;
                case 401:
                    err.message = err.response.data.message;
                    break;
                case 403:
                    err.message = '拒绝访问';
                    break;
                case 404:
                    err.message = '请求出错';
                    break;
                case 408:
                    err.message = '请求超时';
                    break;
                case 500:
                    err.message = err.response.data.message;
                    break;
                case 501:
                    err.message = '服务未实现';
                    break;
                case 502:
                    err.message = '网络错误';
                    break;
                case 503:
                    err.message = '服务不可用';
                    break;
                case 504:
                    err.message = '网络超时';
                    break;
                case 505:
                    err.message = 'HTTP版本不受支持';
                    break;
                default:
                    err.message = `连接出错(${err.response.status})!`;
            }
        } else {
            err.message = '连接服务器失败!'
        }
        if (err.message.length > 50) {
            err.message = err.message.substring(0, 50) + '...';
        }
        Vue.prototype.$message.error(err.message);
        return Promise.reject(err);
    }
);
Axios.interceptors.request.use(
    config => {
        let access_token = localStorage.getItem("access_token");
        if (access_token && !config.headers['No-Need-Token']) {
            config.headers.Authorization = `Bearer ${access_token}`;
        }
        return config;
    },
    err => {
        return Promise.reject(err)
    }
);

export default Axios;
