import Axios from "../config";

let jobPages = (query, page) => {
    return Axios.get('/plc/jobs/unScheduler', {params: {...query, ...page}});
}
let jobDelete = (jobId,version) => {
    return Axios.delete(`/plc/jobs/${jobId}/${version}`);
}

let jobUpdate = (job) => {
    return Axios.put(`/plc/jobs`,job);
}

let getJob = (jobId) => {
    return Axios.get(`/plc/jobs/${jobId}`);
}

let getJobs = (machine) => {
    return Axios.post(`/plc/jobs/jobs`,machine);
}

export default {
    jobPages,
    jobDelete,
    jobUpdate,
    getJob,
    getJobs,
}