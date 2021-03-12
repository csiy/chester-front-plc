<template>
    <v-card :loading="loading">
        <v-card-title>
            <span class="headline">导入任务</span>
        </v-card-title>
        <v-card-text>
            <FileDrag v-if="data.length===0" @data="dataChange" link="/static/download/计划单导入模板.xlsx"/>
            <v-data-table v-else
                          :headers="headers"
                          :items="data"
                          class="elevation-1 px-4 pb-4">
                <template v-slot:top>
                    <v-row align="center" justify="start">
                        <v-btn class="mt-2" @click="data = []"><v-icon left>mdi-cancel</v-icon>取消</v-btn>
                        <v-spacer/>
                        <v-btn color="orange darken-2" :loading="loading" class="mt-2" @click="submit"><v-icon left>mdi-upload</v-icon>导入</v-btn>
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
                                    label="请输入包数"
                                    :rules="[rules.count]"
                                    counter
                            ></v-text-field>
                        </template>
                    </v-edit-dialog>
                </template>
                <template v-slot:item.height="{item}">
                    <v-edit-dialog large :return-value.sync="item.height">
                        {{ item.height }}
                        <template v-slot:input>
                            <v-text-field
                                    v-model.trim="item.height"
                                    label="请输入高"
                                    :rules="[rules.height]"
                                    counter
                            ></v-text-field>
                        </template>
                    </v-edit-dialog>
                </template>
                <template v-slot:item.width="{item}">
                    <v-edit-dialog large :return-value.sync="item.width">
                        {{ item.width }}
                        <template v-slot:input>
                            <v-text-field
                                    v-model.trim="item.width"
                                    label="请输入宽"
                                    :rules="[rules.width]"
                                    counter
                            ></v-text-field>
                        </template>
                    </v-edit-dialog>
                </template>
                <template v-slot:item.highSpeed="{item}">
                    <v-edit-dialog large :return-value.sync="item.highSpeed">
                        {{ item.highSpeed }}
                        <template v-slot:input>
                            <v-text-field
                                    v-model.trim="item.highSpeed"
                                    label="请输入高速速率"
                                    :rules="[rules.highSpeed]"
                                    counter
                            ></v-text-field>
                        </template>
                    </v-edit-dialog>
                </template>
                <template v-slot:item.lowSpeed="{item}">
                    <v-edit-dialog large :return-value.sync="item.lowSpeed">
                        {{ item.lowSpeed }}
                        <template v-slot:input>
                            <v-text-field
                                    v-model.trim="item.lowSpeed"
                                    label="请输入低速速率"
                                    :rules="[rules.lowSpeed]"
                                    counter
                            ></v-text-field>
                        </template>
                    </v-edit-dialog>
                </template>
                <template v-slot:item.lowNumber="{item}">
                    <v-edit-dialog large :return-value.sync="item.lowNumber">
                        {{ item.lowNumber }}
                        <template v-slot:input>
                            <v-text-field
                                    v-model.trim="item.lowNumber"
                                    label="请输入低速量"
                                    :rules="[rules.lowNumber]"
                                    counter
                            ></v-text-field>
                        </template>
                    </v-edit-dialog>
                </template>
                <template v-slot:item.verify="{item}">
                    <v-edit-dialog large :return-value.sync="item.verify">
                        {{ item.verify }}
                        <template v-slot:input>
                            <v-text-field
                                    v-model.trim="item.verify"
                                    label="请输入检字号"
                                    :rules="[rules.verify]"
                                    counter
                            ></v-text-field>
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
                    {text: '高', sortable: false, value: 'height',width:120},
                    {text: '宽', sortable: false, value: 'width',width:120},
                    {text: '高速速率', sortable: false, value: 'highSpeed',width:120},
                    {text: '低速速率', sortable: false, value: 'lowSpeed',width:120},
                    {text: '低速量', sortable: false, value: 'lowNumber',width:120},
                    {text: '检字号', sortable: false, value: 'verify',width:120},
                    {text: '状态', sortable: false, value: 'importStatus',width:120},
                    {text: '操作', sortable: false, value: 'actions',width:120}
                ],
                rules: {
                    materialCode: (v) => v!=null||'请输入物料号',
                    count: (v) => /^[1-9]\d*$/.test(v)&&v<100000000||'请输入包数',
                    aoCode: (v) => v!=null||'请输入AO工序号',
                    height: (v) => v!=null||'请输入高',
                    width: (v) => v!=null||'请输入宽',
                    highSpeed: (v) => v!=null||'请输入高速速率',
                    lowSpeed: (v) => v!=null||'请输入低速速率',
                    lowNumber: (v) => v!=null||'请输入低速量',
                    verify: (v) => v!=null||'请输入检字号',
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
                            height: v['*高'],
                            width: v['*宽'],
                            highSpeed: v['*高速速率'],
                            lowSpeed: v['*低速速率'],
                            lowNumber: v['*低速量'],
                            verify: v['*检字号'],
                            importStatus: ''
                        }
                    })
                }
            },
            submit(){
                if(!this.loading){
                    this.loading = true;
                    let res = true
                    for(let i=0;i<this.data.length;i++){
                        let mission = this.data[i];
                        if(!mission.materialCode){
                            mission.importStatus = "请输入物料号"
                            res = false
                        }else if(!mission.aoCode){
                            mission.importStatus = "请输入AO工序号"
                            res = false
                        }else if(!mission.count){
                            mission.importStatus = "请输入包数"
                            res = false
                        }else if(!mission.height){
                            mission.importStatus = "请输入高"
                            res = false
                        }else if(!mission.width){
                            mission.importStatus = "请输入宽"
                            res = false
                        }else if(!mission.highSpeed){
                            mission.importStatus = "请输入高速速率"
                            res = false
                        }else if(!mission.lowSpeed){
                            mission.importStatus = "请输入低速速率"
                            res = false
                        }else if(!mission.lowNumber){
                            mission.importStatus = "请输入低速量"
                            res = false
                        }else if(!mission.verify){
                            mission.importStatus = "请输入检字号"
                            res = false
                        }
                    }
                    if(res){
                        MissionApi.importMission(this.data).then(()=>{
                            this.$message.success("导入成功")
                            this.$emit('submit', true);
                        }).finally(()=>{
                            this.loading = false
                        })
                    }else{
                        this.$message.warning("数据错误请检查")
                        this.loading = false;
                    }
                }
            },
        }
    }
</script>