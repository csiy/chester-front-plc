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

let machineStart = (machineId,discNo) => {
    return Axios.put(`/plc/machines/start/${machineId}/${discNo}`);
}

let machineStop = (machineId,discNo) => {
    return Axios.put(`/plc/machines/stop/${machineId}/${discNo}`);
}

let setJob = (machineId,discNo) => {
    return Axios.put(`/plc/machines/set/${machineId}/${discNo}`);
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
    setJob,
}