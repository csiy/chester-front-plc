import Axios from "../config";


let getUser = () => {
    return Axios.get('/sys/users/init');
};

let userPages = (query, page) => {
    return Axios.get('/sys/users/pages', {params: {...query, ...page}});
}

let userDisabled = (userId) => {
    return Axios.put('/sys/users/disabled',{userId});
}

let userDelete = (userId) => {
    return Axios.delete('/sys/users/remove',{params:{userId}});
}

let updateUser = (user) =>{
    return Axios.put(`/sys/users/major`,user);
}

let reSetPassword = (userId) => {
    return Axios.put('/sys/users/password',{userId});
}


let userPlus = (user) => {
    return Axios.post(`/sys/users/user`,user);
}

let updateUserInfo = (userInfo) => {
    return Axios.put(`/sys/users/info`,userInfo);
}

export default {
    getUser,
    updateUser,
    userPages,
    reSetPassword,
    userDisabled,
    userDelete,
    userPlus,
    updateUserInfo,
}
