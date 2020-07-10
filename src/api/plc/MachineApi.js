import Axios from "../config";

let machinePages = (query, page) => {
    return Axios.get('/plc/machines', {params: {...query, ...page}});
}
let machineDelete = (machineId,version) => {
    return Axios.delete(`/plc/machines/${machineId}/${version}`);
}
let machinePlus = (machine) => {
    return Axios.post(`/plc/machines`,machine);
}
let machineUpdate = (machine) => {
    return Axios.put(`/plc/machines`,machine);
}
export default {
    machinePages,
    machineDelete,
    machinePlus,
    machineUpdate,
}