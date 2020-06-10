import Axios from "../config";


let getMenus = () => {
    return Axios.get('/sys/menus');
};

let updateMenu = (menu) => {
    return Axios.put(`/sys/menus`,menu);
}

let getModifyMenus = ()=>{
    return Axios.get('/sys/menus/modify');
}

let pullMenu = (menu) => {
    return Axios.put(`/sys/menus/pull`,menu);
}

let pushMenu = (menu) => {
    return Axios.put(`/sys/menus/push`,menu);
}

let userMenus = () => {
    return Axios.get('/sys/menus/user');
}

export default {
    getMenus,
    updateMenu,
    getModifyMenus,
    pullMenu,
    pushMenu,
    userMenus,
}
