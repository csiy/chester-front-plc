<template>
    <v-data-table
            v-model="selected"
            :headers="headers "
            :items="items"
            :loading-text="loadingText"
            show-select
            :server-items-length="page.total"
            :options.sync="options"
            item-key="missionId"
            class="elevation-1 px-4 pb-4 my-4">
        <template v-slot:top>
            <v-row align="center" justify="start">
                <v-col cols="2">
                    <div class="display-2">{{title}}</div>
                </v-col>
                <v-spacer/>
                <v-btn @click="printItems" small color="success" :disabled="selected.length===0">
                    <v-icon left>mdi-cloud-print-outline</v-icon>
                    批量打印
                </v-btn>
                <v-btn small @click="downloadAllMission" color="success">
                    <v-icon left>mdi-download</v-icon>
                    导出
                </v-btn>
            </v-row>
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
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon color="blue-grey lighten-1" @click="deleteItem(item.missionId)">
                        <v-icon>mdi-delete-forever-outline</v-icon>
                    </v-btn>
                </template>
                <span>删除</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon color="blue-grey lighten-1" @click="updateItem(item)">
                        <v-icon>mdi-screw-machine-flat-top</v-icon>
                    </v-btn>
                </template>
                <span>修改</span>
            </v-tooltip>
        </template>
        <template v-slot:no-data>
            未查询到数据
        </template>
    </v-data-table>
</template>

<script>
    import TablePageMixins from "../../mixins/TablePageMixins";
    import DictionaryMixins from "../../mixins/DictionaryMixins";
    import MissionApi from "../../api/plc/MissionApi";
    import Labels from "../../components/label/Labels";
    import MaterialApi from "../../api/plc/MaterialApi";
    import Label from "../../components/label/Label";
    import export_json_to_excel from "../../lib/Export2Excel";
    import DialogUpdateMissionDisk from "../../dialogs/plc/DialogUpdateMissionDisk";

    export default {
        name: "SchedulerJobs",
        props: ['machineId', 'disk', 'searchAction', 'title'],
        mounted() {
            this.query.machineId = this.machineId;
            if(this.disk){
                this.query.disk = this.disk.name;
            }
            this.actions.search = this.searchAction;
            this.search();
            this.interval = setInterval(this.search,10000)
        },
        destroyed() {
          clearInterval(this.interval)
        },
        watch: {
            machineId() {
                this.query.machineId = this.machineId;
                this.search();
            },
            disk() {
                this.query.disk = this.disk.name;
                this.search();
            }
        },
        mixins: [TablePageMixins, DictionaryMixins],
        data() {
            return {
                interval: null,
                selected: [],
                headers: [
                    {text: '任务Id', sortable: false, value: 'missionId'},
                    {text: '物料号', sortable: false, value: 'materialCode'},
                    {text: 'AO工序号', sortable: false, value: 'aoCode'},
                    {text: '包数', sortable: false, value: 'count'},
                    {text: '定额数量', sortable: false, value: 'quantity'},
                    {text: '盘号', sortable: false, value: 'disk'},
                    {text: '生产站位', sortable: false, value: 'position'},
                    {text: '存储BIN位', sortable: false, value: 'bin'},
                    {text: '操作', sortable: false, value: 'action'},
                ],
                dialog: {
                    update: DialogUpdateMissionDisk,
                },
                actions: {
                    remove: MissionApi.missionDelete,
                }
            }
        },
        methods: {
            formatJson(filterVal,jsonData){
                return jsonData.map(v => filterVal.map(j=> v[j]))
            },
            downloadAllMission() {
                if(!this.isDownloadAllJobs){
                    this.isDownloadAllJobs = true
                    this.actions.search(this.query,{
                        curPage: 1,
                        pageSize: this.page.total
                    }).then(v=>{
                        const tHeader = ['任务Id','物料号','AO工序号','包数','定额数量','盘号','生产站位','存储BIN位']
                        const filterVal = ['missionId','materialCode','aoCode','count','quantity','disk','position','bin']
                        const list = v.data.items.map(v=>{
                            return {
                                'missionId':v.missionId,
                                'materialCode':v.materialCode,
                                'aoCode':v.aoCode,
                                'count':v.count,
                                'quantity':v.quantity,
                                'disk':v.disk.name,
                                'position':v.position,
                                'bin':v.bin,
                            }
                        })   //table数据
                        const data = this.formatJson(filterVal,list);
                        export_json_to_excel(tHeader,data,`${this.title}${this.machineId?'-'+this.machineId:''}${this.disk?'-'+this.disk:''}`);  //导出文件名称
                    }).finally(()=>{
                        this.isDownloadAllJobs = false
                    })
                }
            },
            printItem(item){
                MaterialApi.getMaterial(item.materialCode,item.aoCode).then(v=>{
                    this.$dialog.show(Label, {
                        labelSize:{
                            w:10,
                            h:8
                        },
                        missionId: item.missionId,
                        form: {...v.data},
                        width:600,
                    })
                })
            },
            printItems(){
                if(this.selected.length===0){
                    this.$message.warning('请先选择')
                }else{
                    let labels = this.selected.map(v=>{
                        return {
                            missionId:v.missionId,
                            aoCode:v.aoCode,
                            count:v.count,
                            materialCode:v.materialCode,
                            quantity:v.quantity,
                            position:v.position,
                            t:new Date().getTime()
                        }
                    })
                    this.$dialog.show(Labels, {
                        labelSize:{
                            w:10,
                            h:8
                        },
                        labels: labels,
                        width:600,
                    })
                }
            },
        }
    }
</script>

<style scoped>

</style>