<template>
    <v-card :loading="loading">
        <v-card-title>
            <span class="headline">导入任务</span>
        </v-card-title>
        <v-card-text>
            <FileDrag v-if="data.length===0" @data="dataChange" link="/download/计划单导入模板.xlsx"/>
            <v-data-table v-else
                          :headers="headers"
                          :items="data"
                          class="elevation-1 px-4 pb-4">
                <template v-slot:top>
                    <v-row align="center" justify="start">
                        <v-btn class="mt-2" @click="data = []"><v-icon left>mdi-cancel</v-icon>取消</v-btn>
                        <v-spacer/>
                        <v-btn color="orange darken-2" class="mt-2" @click="submit"><v-icon left>mdi-upload</v-icon>导入</v-btn>
                    </v-row>
                </template>
                <template v-slot:item.materialCode="{item}">
                    <v-edit-dialog large :return-value.sync="item.materialCode">
                        {{ item.materialCode }}
                        <template v-slot:input>
                            <v-text-field
                                    v-model.trim="item.materialCode"
                                    label="请输入物料号"
                                    :rules="[rules.materialCode]"
                                    counter
                            ></v-text-field>
                        </template>
                    </v-edit-dialog>
                </template>
                <template v-slot:item.aoCode="{item}">
                    <v-edit-dialog large :return-value.sync="item.aoCode">
                        {{ item.aoCode }}
                        <template v-slot:input>
                            <v-text-field
                                    v-model.trim="item.aoCode"
                                    label="请输入AO工序号"
                                    :rules="[rules.aoCode]"
                                    counter
                            ></v-text-field>
                        </template>
                    </v-edit-dialog>
                </template>
                <template v-slot:item.count="{item}">
                    <v-edit-dialog large :return-value.sync="item.count">
                        {{ item.count }}
                        <template v-slot:input>
                            <v-text-field
                                    v-model.trim="item.count"
                                    label="请输入定额数量"
                                    :rules="[rules.count]"
                                    counter
                            ></v-text-field>
                        </template>
                    </v-edit-dialog>
                </template>
                <template v-slot:item.date="{item}">
                    <v-edit-dialog large :return-value.sync="item.store">
                        {{ item.date }}
                        <template v-slot:input>
                            <v-date-picker v-model="item.date" scrollable></v-date-picker>
                        </template>
                    </v-edit-dialog>
                </template>
                <template v-slot:item.time="{item}">
                    <v-edit-dialog large :return-value.sync="item.time">
                        {{ item.time }}
                        <template v-slot:input>
                            <v-time-picker v-model="item.time" scrollable>
                            </v-time-picker>
                        </template>
                    </v-edit-dialog>
                </template>
                <template v-slot:item.actions="{item}">
                    <v-btn icon color="blue-grey lighten-1" @click="deleteItem(item)">
                        <v-icon>mdi-delete-forever-outline</v-icon>
                    </v-btn>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
</template>

<script>
    import FileDrag from "../../components/base/FileDrag";
    import MissionApi from "../../api/plc/MissionApi";
    import moment from 'moment'
    export default {
        name: "DialogImportMission",
        components: {FileDrag},
        data(){
            return {
                loading: false,
                data: [],
                headers: [
                    {text: '物料号', sortable: false, value: 'materialCode',width:120},
                    {text: 'AO工序号', sortable: false, value: 'aoCode',width:120},
                    {text: '包数', sortable: false, value: 'count',width:120},
                    {text: '需求日期', sortable: false, value: 'date',width:120},
                    {text: '需求时间', sortable: false, value: 'time',width:120},
                    {text: '状态', sortable: false, value: 'importStatus',width:120},
                    {text: '操作', sortable: false, value: 'actions',width:120}
                ],
                rules: {
                    materialCode: (v) => v!=null||'请输入物料号',
                    count: (v) => /^[1-9]\d*$/.test(v)&&v<100000000||'请输入包数',
                    aoCode: (v) => v!=null||'请输入AO工序号',
                }
            }
        },
        methods: {
            deleteItem(item){
                this.data.splice(this.data.indexOf(item),1)
            },
            dataChange(data){
                if(data){
                    this.data = data.map(v=>{
                        return {
                            materialCode:v['*物料号'],
                            aoCode:v['*AO工序号'],
                            count:v['*包数'],
                            date: this.getDate(v['需求日期']),
                            time: this.getTime(v['需求时间']),
                            importStatus: ''
                        }
                    })
                }
            },
            getDate(val){
                if(val){
                    let format="-"
                    const time = new Date((val - 1) * 24 * 3600000 + 1)
                    time.setYear(time.getFullYear() - 70)
                    const year = time.getFullYear() + ''
                    const month = time.getMonth() + 1 + ''
                    const date = time.getDate() - 1 + ''
                    if (format && format.length === 1) {
                        return year + format + month + format + date
                    }
                    return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
                }
                return null
            },
            getTime(val){
                if(val){
                    const time = new Date((val - 1) * 24 * 3600000 + 1)
                    return time.getUTCHours()+':'+time.getMinutes()
                }
                return null
            },
            async submit(){
                if(!this.loading){
                    this.loading = true;
                    let batchNumber = (await MissionApi.getBatchNumber()).data
                    for(let i=0;i<this.data.length;i++){
                        let mission = this.data[i];
                        if(!mission.materialCode){
                            mission.importStatus = "请输入物料号"
                        }else if(!mission.aoCode){
                            mission.importStatus = "请输入AO工序号"
                        }else if(!mission.count){
                            mission.importStatus = "请输入包数"
                        }else{
                            mission.lineNumber = i+1
                            if(mission.date&&mission.time){
                                mission.dateTime = mission.date+" "+mission.time
                            }
                            await MissionApi.missionImport(mission,batchNumber).then(()=>{
                                mission.importStatus = "导入成功"
                            }).catch((v)=>{
                                mission.importStatus = v
                            })
                        }
                        this.loading = false;
                    }
                }
            },
        }
    }
</script>