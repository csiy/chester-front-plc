<template>
    <div style="display: flex;justify-content: flex-start;align-items: center;flex-direction: column;background-color: white;padding: 20px">
        <div style="color: gray;margin-left: 10px;margin-top: 10px">
            <div>图片尺寸:{{labelSize.w}}cm*{{labelSize.h}}cm</div>
        </div>
        <div class="label_style" :style="imageStyle" id="label">
            <div class="label_top">
                <div class="label-item">
                    <div class="title">AO工序号</div>
                    <div class="val">{{form.aoCode}}</div>
                </div>
                <div class="label-item">
                    <div class="title">物料号</div>
                    <div class="val">{{form.materialCode}}</div>
                </div>
            </div>
            <div class="label_bottom">
                <div class="label-left">
                    <div class="label-item">
                        <div class="title">定额数量</div>
                        <div class="val">{{form.quantity}}</div>
                    </div>
                    <div class="label-item">
                        <div class="title">生产站位</div>
                        <div class="val">{{form.position}}</div>
                    </div>
                    <div class="label-item">
                        <div class="title">批次号</div>
                        <div class="val">{{missionId}}</div>
                    </div>
                </div>
                <div class="label-right">
                    <div ref="qrCodeDiv"></div>
                </div>
            </div>
        </div>
        <div style="margin-top: 20px;display: flex;justify-content: center;align-items: center">
            <v-btn small @click="print" class="ma-0">打印</v-btn>
        </div>
    </div>
</template>

<script>
    import html2canvas from 'html2canvas';
    import print from 'print-js'
    import QRCode from 'qrcodejs2'
    export default {
        name: "Label",
        props:['form','labelSize','missionId'],
        mounted(){
            let qrcode_size = this.labelSize.w*37.79*0.3
            new QRCode(this.$refs.qrCodeDiv, {
                text: JSON.stringify([this.missionId,this.form.aoCode,this.form.materialCode,this.form.quantity,this.form.position]),
                width: qrcode_size,
                height: qrcode_size,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
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
            print(){
                html2canvas(document.querySelector("#label")).then(canvas => {
                    let imgData = canvas.toDataURL('image/png');
                    print(imgData, 'image');
                });
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
