import Axios from "../config";

let missionPages = (query, page) => {
    return Axios.get('/plc/missions', {params: {...query, ...page}});
}
let missionDelete = (missionId,version) => {
    return Axios.delete(`/plc/missions/${missionId}/${version}`);
}
let missionPlus = (mission) => {
    return Axios.post(`/plc/missions`,mission);
}
let missionImport = (mission,batchNumber) => {
    return Axios.post(`/plc/missions/import/${batchNumber}`,mission);
}
let missionUpdate = (mission) => {
    return Axios.put(`/plc/missions`,mission);
}
let getBatchNumber = () => {
    return Axios.get(`/plc/missions/batchNumber`);
}
export default {
    missionPages,
    missionDelete,
    missionPlus,
    missionUpdate,
    missionImport,
    getBatchNumber,
}