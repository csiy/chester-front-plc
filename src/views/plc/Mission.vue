<template>
    <v-container fluid>
        <v-data-table
                :loading="loading"
                :headers="headers"
                :items="items"
                hide-default-footer
                :loading-text="loadingText"
                class="elevation-1 px-4 pb-4">
            <template v-slot:top>
                <v-row align="center" justify="start">
                    <v-col cols="1.5">
                        <v-text-field clearable v-model.trim="query.materialCode" label="请输入物料号" hide-details/>
                    </v-col>
                    <v-col cols="1.5">
                        <v-text-field clearable v-model.trim="query.aoCode" label="请输入AO工序号" hide-details/>
                    </v-col>
                    <v-col cols="1.5">
                        <v-select clearable v-model.trim="missionState" :items="missionStatus" item-text="name" item-value="value" label="请选择状态" hide-details/>
                    </v-col>
                    <v-col cols="1.5">
                        <v-menu
                                ref="dateMenu"
                                v-model="dateMenu"
                                :close-on-content-click="false"
                                :return-value.sync="query.date"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                        >
                            <template v-slot:activator="{ on }">
                                <v-text-field
                                        hide-details
                                        clearable
                                        v-model.trim="query.date"
                                        label="操作日期"
                                        prepend-icon="mdi-calendar-account-outline"
                                        readonly
                                        v-on="on"
                                ></v-text-field>
                            </template>
                            <v-date-picker v-model="query.date" scrollable>
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="dateMenu = false">取消</v-btn>
                                <v-btn text color="primary" @click="$refs.dateMenu.save(query.date)">确定</v-btn>
                            </v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="2">
                        <v-btn @click="search">
                            <v-icon left>mdi-magnify</v-icon>
                            搜索
                        </v-btn>
                    </v-col>
                    <v-spacer/>
                    <v-btn @click="downloadMission">
                        <v-icon left>mdi-download</v-icon>
                        导出
                    </v-btn>
                    <v-btn @click="importItem" color="orange darken-2">
                        <v-icon left>mdi-upload</v-icon>
                        导入
                    </v-btn>
                    <v-btn @click="plusItem" color="orange darken-2">
                        <v-icon left>mdi-plus</v-icon>
                        添加
                    </v-btn>
                </v-row>
            </template>
            <template v-slot:item.updatedOn="{ item }">
                {{item.updatedOn|formatTime('YYYY-MM-DD HH:mm')}}
            </template>
            <template v-slot:item.states="{ item }">
                {{states(item)}}
            </template>
            <template v-slot:item.action="{ item }">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" icon color="blue-grey lighten-1" class="mr-2" @click="printItem(item)">
                            <v-icon>mdi-cloud-print-outline</v-icon>
                        </v-btn>
                    </template>
                    <span>打印</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-if="item.transform!==2" v-slot:activator="{ on }">
                        <v-btn v-on="on" icon color="blue-grey lighten-1" class="mr-2" @click="updateItem(item)">
                            <v-icon>mdi-cog-outline</v-icon>
                        </v-btn>
                    </template>
                    <span>修改</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" icon color="blue-grey lighten-1" @click="deleteItem(item.missionId,item.version)">
                            <v-icon>mdi-delete-forever-outline</v-icon>
                        </v-btn>
                    </template>
                    <span>删除</span>
                </v-tooltip>
            </template>
            <template v-slot:no-data>
                未查询到数据
            </template>
            <template v-slot:footer v-if="pageCount">
                <v-divider/>
                <v-pagination class="mt-2" v-model="page.curPage" @input="search" :length="pageCount"
                              :total-visible="totalVisible"/>
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
    import MissionApi from "../../api/plc/MissionApi";
    import TablePageMixins from "../../mixins/TablePageMixins";
    import DictionaryMixins from "../../mixins/DictionaryMixins";
    import DialogPlusMission from "../../dialogs/plc/DialogPlusMission";
    import DialogUpdateMission from "../../dialogs/plc/DialogUpdateMission";
    import DialogImportMission from "../../dialogs/plc/DialogImportMission";
    import Label from "../../components/label/Label";
    import MaterialApi from "../../api/plc/MaterialApi";
    import export_json_to_excel from "../../lib/Export2Excel";
    export default {
        name: "Mission",
        mounted() {
            this.search();
        },
        mixins:[TablePageMixins,DictionaryMixins],
        data() {
            return {
                missionState:null,
                dateMenu: false,
                missionStatus: [
                    {
                        value: 1,
                        name: '未转换'
                    },
                    {
                        value: 2,
                        name: '转换成功'
                    },
                    {
                        value: 3,
                        name: '进行中'
                    },
                    {
                        value: 4,
                        name: '任务完成'
                    },
                    {
                        value: 5,
                        name: '任务异常终止'
                    },
                    {
                        value: 6,
                        name: '已经删除'
                    }
                ],
                headers: [
                    {text: '单号', sortable: false, value: 'missionId'},
                    {text: '行号', sortable: false, value: 'lineNumber'},
                    {text: '物料号', sortable: false, value: 'materialCode',},
                    {text: 'AO工序号', sortable: false, value: 'aoCode',},
                    {text: '包装数量', sortable: false, value: 'count',},
                    {text: '定额数量', sortable: false, value: 'quantity',},
                    {text: '状态', sortable: false, value: 'states',},
                    {text: '操作时间', sortable: false, value: 'updatedOn',},
                    {text: '操作人', sortable: false, value: 'updatedName',},
                    {text: '操作', sortable: false, value: 'action',},
                ],
                query: {
                    materialCode: null,
                    aoCode: null,
                    transform: null,
                    jobStatus: null,
                },
                transformType:{
                    1:'未转换',
                    2:'转换成功',
                    3:'转换时找不到物料 '
                },
                jobStateType:{
                    0: '未执行',
                    1: '进行中',
                    2: '任务完成',
                    3: '任务异常终止',
                    4: '已删除'
                },
                dialog: {
                    plus: DialogPlusMission,
                    update: DialogUpdateMission,
                    import: DialogImportMission
                },
                actions:{
                    remove: MissionApi.missionDelete,
                    search: MissionApi.missionPages
                }
            }
        },
        watch:{
            missionState(){
                if(this.missionState){
                    if(this.missionState<3){
                        this.query.transform = this.missionState
                        this.query.jobStatus = null
                    }else{
                        this.query.transform = null
                        this.query.jobStatus = this.missionState - 2
                    }
                }else{
                    this.query.jobStatus = null
                    this.query.transform = null
                }
            }
        },
        methods: {
            formatJson(filterVal,jsonData){
                return jsonData.map(v => filterVal.map(j=> v[j]))
            },
            downloadMission(){
                MissionApi.missionPages(this.query,{
                    curPage: 1,
                    pageSize: this.page.total
                }).then(v=>{
                    const tHeader = ['单号','行号','物料号','AO工序号','包装数量','定额数量','状态']
                    const filterVal = ['missionId','lineNumber','materialCode','aoCode','count','quantity','states']
                    const list = v.data.items.map(v=>{
                        return {
                            'missionId':v.missionId,
                            'lineNumber':v.lineNumber,
                            'materialCode':v.materialCode,
                            'aoCode':v.aoCode,
                            'count':v.count,
                            'quantity':v.quantity,
                            'states':this.states(v),
                        }
                    })   //table数据
                    const data = this.formatJson(filterVal,list);
                    export_json_to_excel(tHeader,data,'任务');  //导出文件名称
                })
            },
            printItem(item){
                MaterialApi.getMaterial(item.materialCode,item.aoCode).then(v=>{
                    this.$dialog.show(Label, {
                        pageSize: {
                            w:6,
                            h:4
                        },
                        labelSize:{
                            w:6,
                            h:4
                        },
                        missionId: item.missionId,
                        form: {...v.data},
                        width:600,
                    })
                })
            },
            states(item){
                if(item.transform===2){
                    if(item.jobStatus===0){
                        return this.transformType[item.transform]
                    }else{
                        return this.jobStateType[item.jobStatus]
                    }
                }else{
                    return this.transformType[item.transform]
                }
            }
        }
    }
</script>

<style scoped>

</style>