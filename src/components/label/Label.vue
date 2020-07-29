<template>
    <div style="display: flex;justify-content: flex-start;align-items: center;flex-direction: column;background-color: white;padding: 20px">
        <div style="color: gray;margin-left: 10px;margin-top: 10px">
            <div>纸张尺寸:{{pageSize.w}}cm*{{pageSize.h}}cm</div>
            <div>图片尺寸:{{labelSize.w}}cm*{{labelSize.h}}cm</div>
        </div>
        <div style="border: 1px #999999 dashed">
            <div class="label_style" :style="imageStyle" id="label">
                <div class="label-left">
                    <div class="label-item">
                        <div class="title">AO工序号</div>
                        <div class="val">{{form.aoCode}}</div>
                    </div>
                    <div class="label-item">
                        <div class="title">物料号</div>
                        <div class="val">{{form.materialCode}}</div>
                    </div>
                    <div class="label-item">
                        <div class="title">定额数量</div>
                        <div class="val">{{form.quantity}}</div>
                    </div>
                    <div class="label-item">
                        <div class="title">生产站位</div>
                        <div class="val">{{form.position}}</div>
                    </div>
                </div>
                <div class="label-right">
                    <div ref="qrCodeDiv"></div>
                </div>
            </div>
        </div>
        <div style="margin-top: 20px;display: flex;justify-content: center;align-items: center">
            <v-btn small @click="print">打印</v-btn>
        </div>
    </div>
</template>

<script>
    import html2canvas from 'html2canvas';
    import print from 'print-js'
    import QRCode from 'qrcodejs2'
    export default {
        name: "Label",
        props:['form','labelSize','pageSize','missionId'],
        mounted(){
            new QRCode(this.$refs.qrCodeDiv, {
                text: JSON.stringify([this.missionId,this.form.aoCode,this.form.materialCode,this.form.quantity,this.form.position]),
                width: 80,
                height: 80,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            })
        },
        computed: {
            tableStyle(){
                return {
                    width:`${this.labelSize.w*37.79}px`,
                    height:`${this.labelSize.h*37.79}px`,
                }
            },
            imageStyle(){
                return {
                    width: `${this.pageSize.w*37.79}px`,
                    height: `${this.pageSize.h*37.79}px`,
                }
            },
        },
        methods: {
            print(){
                html2canvas(document.querySelector("#label")).then(canvas => {
                    let ctx = canvas.getContext("2d");
                    let imgData = canvas.toDataURL('image/png');
                    console.log(imgData);
                    let img = new Image();
                    let contentWidth = canvas.width;
                    let contentHeight = canvas.height;
                    img.src = imgData;
                    img.width = contentWidth;
                    img.height = contentHeight;
                    //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
                    //根据图片的尺寸设置pdf的规格，要在图片加载成功时执行，之所以要*0.5是因为比例问题
                    img.onload = function () {
                        print(imgData, 'image');
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .label_style{
        font-weight: bold;
        display: flex;
        color: #000000;
        border: 1px solid #000000;
        .label-left{
            flex: 1;
            height: 100%;
            .label-item{
                display: flex;
                height: 25%;
                .title{
                    border: 1px solid #000000;
                    flex: 1;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    font-size:12px
                }
                .val{
                    border: 1px solid #000000;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    flex: 1;
                    overflow: hidden;
                    font-size:12px
                }
            }
        }
        .label-right{
            flex: 1;
            height: 100%;
            border: 1px solid #000000;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
</style>
