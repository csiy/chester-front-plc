<template>
    <v-container fluid>
        <v-card :loading="loadingMachines" class="pb-4">
            <v-slide-group v-model="machineNum" class="pa-4" mandatory show-arrows>
                <v-slide-item v-for="item in machines" :key="item.machineId" v-slot:default="{ active, toggle }">
                    <v-card :color="active ? 'primary' : 'grey lighten-3'" :dark="active" class="mr-4 pa-2" height="100" width="150" @click="toggle">
                        <div>设备:{{item.machineId}}</div>
                        <div class="d-flex text-center align-center">状态:<v-sheet dark class="ml-2 lighten-1 px-1" :color="item.linkState?'orange':'teal'">{{item.linkState?'已链接':'未链接'}}</v-sheet></div>
                        <div>当前盘:{{item.disk}}</div>
                    </v-card>
                </v-slide-item>
            </v-slide-group>
            <v-divider/>
            <v-card elevation="0" class="d-flex justify-space-between pa-4">
                <div class="d-flex align-center">
                    <div class="text-center d-flex align-center">
                        <v-sheet>当前设备：</v-sheet>
                        <v-sheet width="100" dark class="orange lighten-1 pa-1">{{machine.machineId}}</v-sheet>
                        <v-sheet class="ml-4">运行状态：</v-sheet>
                        <v-sheet width="100" dark class="teal lighten-1 pa-1">{{machine.runState?'已经运行':'未运行'}}</v-sheet>
                        <v-sheet class="ml-4">当前排程：</v-sheet>
                        <v-sheet width="200" dark class="teal lighten-1 pa-1">
                            {{runtimeJobSetStatusMap[machine.runtimeJobSetStatus]}}{{job?' ：'+job.jobId:''}}
                        </v-sheet>
                    </div>
                </div>
                <div class="d-flex" v-if="machine.linkState&&machine.runtimeJob">
                    <v-btn icon v-if="machine.runtimeJobSetStatus===2">
                        <v-icon color="orange" @click="stopMachine" v-if="machine.runState">mdi-stop-circle-outline</v-icon>
                        <v-icon color="primary" v-else @click="startMachine">mdi-play-circle-outline</v-icon>
                    </v-btn>
                    <div v-else class="d-flex align-center" v-if="machine.runtimeJobSetStatus===1">
                        <v-btn color="orange" text @click="setRuntimeJob(job)">重新设置</v-btn>
                    </div>
                </div>
                <div class="d-flex" v-if="machine.linkState&&machine.runtimeJobSetStatus===0&&jobs&&jobs.length>0">
                    <v-btn color="orange" text @click="setRuntimeJob(jobs[0])">下一个任务</v-btn>
                </div>
            </v-card>
            <v-divider/>
            <v-card elevation="0" :loading="loadingGetJob" v-if="job" class="d-flex justify-start flex-wrap pa-4">
                <div style="width: 250px;line-height: 32px" class="text-truncate" :title="job.material.quantity">包装总数:{{job.mission.count*job.material.quantity}}</div>
                <div style="width: 250px;line-height: 32px" class="text-truncate" :title="job.material.quantity">包数:{{job.mission.count}}</div>
                <div style="width: 250px;line-height: 32px" class="text-truncate" :title="job.material.quantity">定额数量:{{job.material.quantity}}</div>
                <div style="width: 250px;line-height: 32px" class="text-truncate" :title="job.material.materialCode">物料号:{{job.material.materialCode}}</div>
                <div style="width: 250px;line-height: 32px" class="text-truncate" :title="job.material.aoCode">AO工序号:{{job.material.aoCode}}</div>
                <div style="width: 250px;line-height: 32px" class="text-truncate" :title="job.material.disk">盘号:{{job.material.disk}}</div>
                <div style="width: 250px;line-height: 32px" class="text-truncate" :title="job.material.position">生产站位:{{job.material.position}}</div>
                <div style="width: 250px;line-height: 32px" class="text-truncate" :title="job.material.bin">存储BIN位:{{job.material.bin}}</div>
            </v-card>
        </v-card>
        <v-data-table
                v-model="selected"
                :loading="loadingGetJobs"
                :headers="headers "
                :items="jobs"
                :loading-text="loadingText"
                show-select
                item-key="jobId"
                class="elevation-1 px-4 pb-4 my-4">
            <template v-slot:top>
                <v-row align="center" justify="start">
                    <v-col cols="2">
                        <div class="display-2">已排程列表</div>
                    </v-col>
                    <v-spacer/>
                    <v-btn @click="printItems" small color="success" :disabled="selected.length===0">
                        <v-icon left>mdi-cloud-print-outline</v-icon>
                        批量打印
                    </v-btn>
                    <v-btn small @click="downloadMachineJobs">
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
                        <v-btn v-on="on" icon color="blue-grey lighten-1" @click="deleteItem(item.jobId,item.version)">
                            <v-icon>mdi-delete-forever-outline</v-icon>
                        </v-btn>
                    </template>
                    <span>删除</span>
                </v-tooltip>
            </template>
            <template v-slot:no-data>
                未查询到数据
            </template>
        </v-data-table>
        <v-data-table
                v-model="selected1"
                :loading="loading"
                :headers="headers"
                :items="items"
                hide-default-footer
                :loading-text="loadingText"
                show-select
                item-key="jobId"
                class="elevation-1 px-4 pb-4">
            <template v-slot:top>
                <v-row align="center" justify="start">
                    <v-col cols="2">
                        <div class="display-2">未排程列表</div>
                    </v-col>
                    <v-spacer/>
                    <v-btn @click="printItems1" small color="success" :disabled="selected1.length===0">
                        <v-icon left>mdi-cloud-print-outline</v-icon>
                        批量打印
                    </v-btn>
                    <v-btn small @click="downloadAllJobs" :loading="isDownloadAllJobs">
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
                        <v-btn v-on="on" icon color="blue-grey lighten-1" @click="deleteItem(item.jobId,item.version)">
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
    import TablePageMixins from "../../mixins/TablePageMixins";
    import DictionaryMixins from "../../mixins/DictionaryMixins";
    import JobApi from "../../api/plc/JobApi";
    import MachineApi from "../../api/plc/MachineApi";
    import export_json_to_excel  from '../../lib/Export2Excel'
    import MaterialApi from "../../api/plc/MaterialApi";
    import Label from "../../components/label/Label";
    import Labels from "../../components/label/Labels";

    export default {
        name: "Job",
        mounted() {
            this.search();
            this.getMachineAll();
            this.interval = setInterval(this.getMachineAll,10000)
        },
        mixins:[TablePageMixins,DictionaryMixins],
        data() {
            return {
                selected:[],
                selected1:[],
                runtimeJobSetStatusMap:{
                    0:'未设置',
                    1:'正在设置',
                    2:'已设置',
                },
                headers: [
                    {text: '任务Id', sortable: false, value: 'jobId'},
                    {text: '物料号', sortable: false, value: 'material.materialCode'},
                    {text: 'AO工序号', sortable: false, value: 'material.aoCode'},
                    {text: '包数', sortable: false, value: 'mission.count'},
                    {text: '定额数量', sortable: false, value: 'material.quantity'},
                    {text: '盘号', sortable: false, value: 'material.disk'},
                    {text: '生产站位', sortable: false, value: 'material.position'},
                    {text: '存储BIN位', sortable: false, value: 'material.bin'},
                    {text: '操作', sortable: false, value: 'action'},
                ],
                interval: null,
                machine: {},
                machineNum: null,
                machines:[],
                query: {

                },
                job:null,
                jobs:[],
                actions:{
                    remove: JobApi.jobDelete,
                    search: JobApi.jobPages
                },
                loadingGetJob:false,
                loadingGetJobs:false,
                loadingMachines:false,
                isDownloadAllJobs:false
            }
        },
        watch:{
            machineNum(){
                if(this.machines.length>0){
                    this.machine = this.machines[this.machineNum];
                    this.getJob()
                    this.getJobs()
                    this.search()
                }
            }
        },
        destroyed(){
            if(this.interval){
                clearInterval(this.interval)
            }
        },
        methods:{
            formatJson(filterVal,jsonData){
                return jsonData.map(v => filterVal.map(j=> v[j]))
            },
            downloadMachineJobs(){
                const tHeader = ['任务Id','物料号','AO工序号','包数','定额数量','盘号','生产站位','存储BIN位']
                const filterVal = ['jobId','materialCode','aoCode','count','quantity','disk','position','bin']
                const list = this.jobs.map(v=>{
                    return {
                        'jobId':v.jobId,
                        'materialCode':v.material.materialCode,
                        'aoCode':v.material.aoCode,
                        'count':v.mission.count,
                        'quantity':v.material.quantity,
                        'disk':v.material.disk,
                        'position':v.material.position,
                        'bin':v.material.bin,
                    }
                })   //table数据
                const data = this.formatJson(filterVal,list);
                export_json_to_excel(tHeader,data,'已排程');  //导出文件名称
            },
            downloadAllJobs(){
                if(!this.isDownloadAllJobs){
                    this.isDownloadAllJobs = true
                    JobApi.jobPages(this.query,{
                        curPage: 1,
                        pageSize: this.page.total
                    }).then(v=>{
                        const tHeader = ['任务Id','物料号','AO工序号','包数','定额数量','盘号','生产站位','存储BIN位']
                        const filterVal = ['jobId','materialCode','aoCode','count','quantity','disk','position','bin']
                        const list = v.data.items.map(v=>{
                            return {
                                'jobId':v.jobId,
                                'materialCode':v.material.materialCode,
                                'aoCode':v.material.aoCode,
                                'count':v.mission.count,
                                'quantity':v.material.quantity,
                                'disk':v.material.disk,
                                'position':v.material.position,
                                'bin':v.material.bin,
                            }
                        })   //table数据
                        const data = this.formatJson(filterVal,list);
                        export_json_to_excel(tHeader,data,'未排程');  //导出文件名称
                    }).finally(()=>{
                        this.isDownloadAllJobs = false
                    })
                }

            },
            setRuntimeJob(item){
                MachineApi.setJob(this.machine.machineId,item.jobId).then(v=>{
                    this.getMachineAll();
                })
            },
            async deleteItem(id,version) {
                if(this.actions.remove){
                    let res = await this.$dialog.confirm({
                        text: `确认要删除吗？删除后将无法恢复！`,
                        title: '删除'
                    })
                    if (res) {
                        this.actions.remove(id,version).then(() => {
                            this.getMachineAll();
                        });
                    }
                }
            },
            async startMachine() {
                if (this.machine.machineId) {
                    let res = await this.$dialog.confirm({
                        text: `请检查挡位是否正确，上料是否完毕？`,
                        title: '开始'
                    })
                    if(res){
                        MachineApi.machineStart(this.machine.machineId, this.machine.version).then(v => {
                            this.getMachineAll();
                        })
                    }
                }
            },
            async stopMachine() {
                if (this.machine.machineId) {
                    let res = await this.$dialog.confirm({
                        text: `请检查本次任务实际是否已完成？`,
                        title: '结束'
                    })
                    if(res){
                        MachineApi.machineStop(this.machine.machineId, this.machine.version).then(v => {
                            this.getMachineAll();
                        })
                    }
                }
            },
            getMachineAll(){
                if(!this.loadingMachines){
                    this.loadingMachines = true
                    MachineApi.machineAll().then(v=>{
                        this.loadingMachines = false
                        this.machines = v.data;
                        if(this.machines.length>0){
                            if(this.machineNum==null){
                                this.machineNum = 0;
                            }else{
                                this.machine = this.machines.filter(v=>v.machineId===this.machine.machineId)[0];
                                this.getJobs();
                                this.getJob()
                                this.search()
                            }
                        }
                    })
                }
            },
            search() {
                if(this.actions.search){
                    if (!this.loading) {
                        this.loading = true;
                        this.actions.search(this.query, this.page).then(v => {
                            this.page = v.data.page;
                            this.items = v.data.items.map(v=>{
                               return {
                                   ...v,
                                   gears:v.material.gears,
                                   dish:v.material.dish
                               }
                            })
                        }).finally(() => {
                            this.loading = false;
                        })
                    }
                }
            },
            getJob(){
                if(!this.loadingGetJob&&this.machine.runtimeJob){
                    this.loadingGetJob = true;
                    JobApi.getJob(this.machine.runtimeJob).then(v=>{
                        this.loadingGetJob = false;
                        this.job = v.data;
                    })
                }else{
                    this.job = null
                }
            },
            getJobs(){
                if(!this.loadingGetJobs){
                    this.loadingGetJobs = true;
                    JobApi.getJobs(this.machine.machineId).then(v=>{
                        this.loadingGetJobs = false;
                        this.jobs = v.data;
                    })
                }else {
                    this.jobs = []
                }
            },
            printItem(item){
                MaterialApi.getMaterial(item.material.materialCode,item.material.aoCode).then(v=>{
                    this.$dialog.show(Label, {
                        labelSize:{
                            w:10,
                            h:8
                        },
                        missionId: item.mission.missionId,
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
                            missionId:v.jobId,
                            aoCode:v.material.aoCode,
                            materialCode:v.material.materialCode,
                            quantity:v.material.quantity,
                            position:v.material.position,
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
            printItems1(){
                if(this.selected1.length===0){
                    this.$message.warning('请先选择')
                }else{
                    let labels = this.selected1.map(v=>{
                        return {
                            missionId:v.jobId,
                            aoCode:v.material.aoCode,
                            materialCode:v.material.materialCode,
                            quantity:v.material.quantity,
                            position:v.material.position,
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
            }
        }
    }
</script>

<style scoped>

</style>
