import Axios from "../config";

let jobPages = (query, page) => {
    return Axios.get('/plc/jobs/unScheduler', {params: {...query, ...page}});
}
let jobDelete = (jobId,version) => {
    return Axios.delete(`/plc/jobs/${jobId}/${version}`);
}

let getJob = (jobId) => {
    return Axios.get(`/plc/jobs/${jobId}`);
}

let getJobs = (machineId) => {
    return Axios.get(`/plc/jobs/jobs/${machineId}`);
}

export default {
    jobPages,
    jobDelete,
    getJob,
    getJobs,
}