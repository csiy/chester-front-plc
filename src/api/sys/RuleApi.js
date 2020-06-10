import Axios from "../config";


let getRules = () => {
    return Axios.get('/sys/rules');
};

let getMyRules = () =>{
    return Axios.get('/sys/rules/mine');
}

let updateRule = (rule) => {
    return Axios.put(`/sys/rules`,rule);
}

let pushRule = (rules) =>{
    return Axios.put(`/sys/rules/push`,rules);
}

let pullRule = (rules) =>{
    return Axios.put(`/sys/rules/pull`,rules);
}

export default {
    getRules,
    getMyRules,
    updateRule,
    pushRule,
    pullRule,
}
