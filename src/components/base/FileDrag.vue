<template>
    <div class="d-flex justify-center align-center flex-column">
        <el-upload class="upload-demo" accept=".xlsx" action="http://www.baidu.com" :on-change="fileChange" :auto-upload="autoUpload" drag>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <div class="el-upload__tip" slot="tip">只能上传xlsx文件，<a :href="link">下载模板</a></div>
    </div>
</template>

<script>
    import XLSX from 'xlsx';
    export default {
        name: "FileDrag",
        props:['link'],
        data(){
            return {
                autoUpload: false
            }
        },
        methods:{
            fixData(data) {
                let o = ''
                let l = 0
                let w = 10240
                for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
                o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
                return o
            },
            fileChange(file){
                const fileReader = new FileReader();
                fileReader.onload = (ev) => {
                    try {
                        let data = ev.target.result;
                        const workbook = XLSX.read(btoa(this.fixData(data)), {type: 'base64'})
                        if(workbook.Sheets.Sheet1){
                            let datas = XLSX.utils.sheet_to_json(workbook.Sheets.Sheet1);
                            this.$emit("data",datas)
                        }
                    } catch (e) {
                        this.$message.warning('文件类型不正确！');
                        return false;
                    }
                };
                fileReader.readAsArrayBuffer(file.raw);
            }
        }
    }
</script>

<style scoped>

</style>