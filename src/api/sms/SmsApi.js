import Axios from "../config";

let getSmsCode = (phone,codeType)=>{
    return Axios.post('/base/sms/code',{phone,codeType});
}

export default {
    getSmsCode,
}