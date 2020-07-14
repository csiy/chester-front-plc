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
let machineUpdateDish = (machine) => {
    return Axios.put(`/plc/machines/dish`,machine);
}

let machineAll = () => {
    return Axios.get('/plc/machines/all');
}

let machineStart = (machineId,version) => {
    return Axios.put(`/plc/machines/start/${machineId}/${version}`);
}

let machineStop = (machineId,version) => {
    return Axios.put(`/plc/machines/stop/${machineId}/${version}`);
}

let nextJob = (machineId,jobId,version) => {
    return Axios.put(`/plc/machines/next/${machineId}/${jobId}/${version}`);
}

let reSort = (machine) => {
    return Axios.put(`/plc/machines/reSort`,machine);
}


export default {
    machinePages,
    machineDelete,
    machinePlus,
    machineUpdate,
    machineUpdateDish,
    machineAll,
    machineStart,
    machineStop,
    nextJob,
    reSort,
}