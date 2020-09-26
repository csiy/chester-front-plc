<template>
    <div style="display: flex;justify-content: flex-start;align-items: center;flex-direction: column;background-color: white;padding: 20px">
        <div style="color: gray;margin-left: 10px;margin-top: 10px">
            <div>图片尺寸:{{labelSize.w}}cm*{{labelSize.h}}cm</div>
        </div>
        <div class="label_style" :style="imageStyle" :id="'id'+item.missionId" v-for="item in items">
            <div class="label_top">
                <div class="label-item">
                    <div class="title">AO工序号</div>
                    <div class="val">{{item.aoCode}}</div>
                </div>
                <div class="label-item">
                    <div class="title">物料号</div>
                    <div class="val">{{item.materialCode}}</div>
                </div>
            </div>
            <div class="label_bottom">
                <div class="label-left">
                    <div class="label-item">
                        <div class="title">定额数量</div>
                        <div class="val">{{item.quantity}}</div>
                    </div>
                    <div class="label-item">
                        <div class="title">生产站位</div>
                        <div class="val">{{item.position}}</div>
                    </div>
                    <div class="label-item">
                        <div class="title">批次号</div>
                        <div class="val">{{item.missionId}}</div>
                    </div>
                </div>
                <div class="label-right">
                    <div :id="'qrCodeDiv_'+item.missionId+item.t"></div>
                </div>
            </div>
        </div>
        <div style="margin-top: 20px;display: flex;justify-content: center;align-items: center">
            <v-btn small @click="print" class="ma-0" color="success" :loading="loading">打印</v-btn>
        </div>
    </div>
</template>

<script>
    import html2canvas from 'html2canvas';
    import print from 'print-js'
    import { jsPDF } from "jspdf";
    import QRCode from 'qrcodejs2'
    export default {
        name: "Labels",
        props:['labels','labelSize'],
        data(){
            return {
                items:[],
                loading: false
            }
        },
        mounted(){
            this.items = this.labels;
            this.$nextTick(function(){
            });
            this.$nextTick(function(){
                let qrcode_size = this.labelSize.w*37.79*0.3
                for(let i in this.items){
                    let item = this.items[i]
                    new QRCode(document.getElementById('qrCodeDiv_'+item.missionId+item.t), {
                        text: JSON.stringify([item.missionId,item.aoCode,item.materialCode,item.quantity,item.position]),
                        width: qrcode_size,
                        height: qrcode_size,
                        colorDark: '#000000',
                        colorLight: '#ffffff',
                        correctLevel: QRCode.CorrectLevel.H
                    })
                }
            })
        },
        computed: {
            imageStyle(){
                return {
                    width: `${this.labelSize.w*37.79}px`,
                    height: `${this.labelSize.h*37.79}px`,
                }
            },
        },
        methods: {
            async print(){
                this.loading = true
                const doc = new jsPDF('l', 'cm', [this.labelSize.w, this.labelSize.h])
                for(let i = 0;i<this.items.length;i++){
                    let item = this.items[i]
                    let id = 'id'+item.missionId
                    console.log('打印 id ：'+id)
                    let canvas = await html2canvas(document.getElementById(id))
                    let imgData = canvas.toDataURL('image/png');
                    for (let j = 0;j<item.count;j++){
                        if(!(i===0&&j===0)){
                            doc.addPage([this.labelSize.w, this.labelSize.h],'l')
                        }
                        doc.addImage(imgData, 'png', 0, 0, this.labelSize.w, this.labelSize.h, id)
                    }
                }
                doc.save();
                this.loading = false
            }
        }
    }
</script>

<style lang="scss" scoped>
    .label_style{
        font-weight: bold;
        display: flex;
        flex-direction: column;
        color: #000000;
        border: 1px solid #000000;
        margin-bottom: 5px;
        .label-item{
            display: flex;
            .title{
                border: 1px solid #000000;
                width: 80px;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                padding: 2px;
                font-size:16px;
                font-weight: bold;
            }
            .val{
                border: 1px solid #000000;
                display: flex;
                flex: auto;
                justify-content: flex-start;
                align-items: center;
                padding: 2px;
                overflow: hidden;
                font-size:16px;
                font-weight: bold;
            }
        }
        .label_top{
            flex-direction: column;
            display: flex;
            height: 40%;
            .label-item{
                height: 50%;
            }
        }
        .label_bottom{
            display: flex;
            height: 60%;
            .label-item{
                height: 33.3%;
            }
            .label-left{
                flex-direction: column;
                display: flex;
                flex: 1;
            }
            .label-right{
                border: 1px solid #000000;
                display: flex;
                flex: 1;
                justify-content: center;
                align-items: center;
            }
        }
    }
</style>
