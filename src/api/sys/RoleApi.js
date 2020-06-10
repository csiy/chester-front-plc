import Axios from "../config";


let getRoles = () => {
    return Axios.get('/sys/roles');
};

let deleteRole = (roleId) => {
    return Axios.delete('/sys/roles',{params:{roleId}});
}

let plusRole = (data) => {
    return Axios.post('/sys/roles',data);
}

export default {
    getRoles,
    deleteRole,
    plusRole,
}
