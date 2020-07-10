import Axios from "../config";

let materialPages = (query, page) => {
    return Axios.get('/plc/materials', {params: {...query, ...page}});
}
let materialDelete = (materialId,version) => {
    return Axios.delete(`/plc/materials/${materialId}/${version}`);
}
let materialPlus = (material) => {
    return Axios.post(`/plc/materials`,material);
}
let materialUpdate = (material) => {
    return Axios.put(`/plc/materials`,material);
}
export default {
    materialPages,
    materialDelete,
    materialPlus,
    materialUpdate,
}
