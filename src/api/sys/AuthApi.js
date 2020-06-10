import Axios from "../config";

let client_id = 'app';
let client_secret = 'secret';
let interval = null;

let refresh = () => {
    let refresh_token = window.localStorage.refresh_token;
    if (refresh_token) {
        return Axios.post(`/oauth/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=refresh_token&refresh_token=${refresh_token}`, {}, {
            headers: {
                'No-Need-Token': true,
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }).then(v => {
            console.log("setting auth to localStorage by refresh");
            let auth = v.data;
            window.localStorage.access_token = auth.access_token;
            window.localStorage.refresh_token = auth.refresh_token;
            window.localStorage.expires_in = auth.expires_in;
        }).catch(v => {
            logout();
        })
    } else {
        logout();
    }
};

let setRefresh = () => {
    if (interval == null) {
        let timeout = 6 * 60 * 60 * 1000;
        console.log(`setting interval ${timeout} millisecond to refresh auth`);
        interval = setInterval(refresh, timeout);
    }
};

let login = (login, password) => {
    return Axios.post(`/oauth/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=password&scope=all&username=${login}&password=${password}`, {}, {
        headers: {
            'No-Need-Token': true,
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }).then(v => {
        console.log("setting auth to localStorage by password login");
        let auth = v.data;
        window.localStorage.access_token = auth.access_token;
        window.localStorage.refresh_token = auth.refresh_token;
        window.localStorage.expires_in = auth.expires_in;
    }).then(v => {
        setRefresh();
    });
};

let loginByAuth = () => {
    return new Promise((resolve, reject) => {
        let refresh_token = window.localStorage.refresh_token;
        if (refresh_token) {
            refresh().then(v => {
                setRefresh();
                resolve(v);
            })
        } else {
            reject();
        }
    });
};
let logout = () => {
    if (interval != null) {
        clearInterval(interval);
        interval = null;
    }
    window.localStorage.clear();
};

export default {login, loginByAuth, logout}
