import Axios from "../config";

let missionPages = (query, page) => {
    return Axios.get('/plc/missions', {params: {...query, ...page}});
}
let missionDelete = (missionId) => {
    return Axios.delete(`/plc/missions/${missionId}`);
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

let importMission = (missions) => {
    return Axios.post(`/plc/missions/import`,{missions});
}

let verifyMission = (materials) => {
    return Axios.post(`/plc/missions/verify`,{materials});
}

export default {
    missionPages,
    missionDelete,
    missionPlus,
    missionUpdate,
    missionImport,
    importMission,
    verifyMission,
}