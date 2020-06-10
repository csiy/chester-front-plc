import Axios from "../config";


let uploadAudio = (file,name,output,quality) => {
    let formData=new FormData();
    formData.append('name',name||"音频");
    formData.append('file',file);
    formData.append('output',output||'mpeg');
    formData.append('quality',quality||'original');
    return Axios.post('/file/upload/audio/binary',file,{
        'Content-Type':'multipart/form-data',
        timeout:100000000,
    });
};

let uploadImage = (file,compress) => {
    let formData=new FormData();
    formData.append('compress',compress||true);
    formData.append('file',file);
    return Axios.post('/file/upload/image/binary',formData,{
        'Content-Type':'multipart/form-data',
        timeout:100000000,
    });
};

let uploadFile = (file) => {
    let formData=new FormData();
    formData.append('file',file);
    return Axios.post('/file/upload/file/binary',formData,{
        'Content-Type':'multipart/form-data',
        timeout:100000000,
    });
};

let uploadTmp = (file) => {
    let formData=new FormData();
    formData.append('file',file);
    return Axios.post('/file/upload/tmp/binary',formData,{
        'Content-Type':'multipart/form-data',
        timeout:100000000,
    });
};

let uploadVideo = (file,name,output,quality) => {
    let formData=new FormData();
    formData.append('file',file);
    formData.append('output',output||'mpeg');
    formData.append('quality',quality||'original');
    return Axios.post('/file/upload/video/binary',formData,{
        'Content-Type':'multipart/form-data',
        timeout:100000000,
    });
};


export default {
    uploadAudio,
    uploadImage,
    uploadFile,
    uploadTmp,
    uploadVideo
}
