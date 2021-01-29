import Axios from "../config";

let client_id = 'app';
let client_secret = 'secret';
let interval = null;

let login = (login, password) => {
    return Axios.post(`/oauth/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=password&scope=all&username=${login}&password=${password}`, {}, {
        headers: {
            'No-Need-Token': true,
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }).then(v => {
        let auth = v.data;
        window.localStorage.access_token = auth.access_token;
        window.localStorage.refresh_token = auth.refresh_token;
        window.localStorage.expires_in = auth.expires_in;
    }).then(v => {
    });
};

let logout = () => {
    if (interval != null) {
        clearInterval(interval);
        interval = null;
    }
    window.localStorage.clear();
};

export default {login, logout}
