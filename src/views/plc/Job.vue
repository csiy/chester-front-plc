<template>
    <v-container fluid>
        <v-card :loading="loadingMachines" class="pb-4">
            <v-slide-group v-model="machineNum" class="pa-4" mandatory show-arrows>
                <v-slide-item v-for="item in machines" :key="item.machineId" v-slot:default="{ active, toggle }">
                    <v-card :color="active ? 'primary' : 'grey lighten-3'" :dark="active" class="mr-4 pa-2" height="100" width="150" @click="toggle">
                        <div>设备:{{item.machineId}}</div>
                        <div class="d-flex text-center align-center">状态:<v-sheet dark class="ml-2 lighten-1 px-1" :color="item.linkState?'orange':'teal'">{{item.linkState?'已链接':'未链接'}}</v-sheet></div>
                        <div>当前盘号:{{item.runtimeDishNumber===-1?"未设置":item.runtimeDishNumber}}</div>
                        <div>当前盘:{{!item.runtimeDish?"未设置":dishDictionary[item.runtimeDish.dish]+'盘'+gearsDictionary[item.runtimeDish.gears]+'挡'}}</div>
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
                <div style="width: 250px;line-height: 32px" class="text-truncate" :title="job.material.gears">挡位:{{gearsDictionary[job.material.gears]}}</div>
                <div style="width: 250px;line-height: 32px" class="text-truncate" :title="job.material.dish">盘号:{{dishDictionary[job.material.dish]}}</div>
                <div style="width: 250px;line-height: 32px" class="text-truncate" :title="job.material.position">生产站位:{{job.material.position}}</div>
                <div style="width: 250px;line-height: 32px" class="text-truncate" :title="job.material.store">存储区域:{{job.material.store}}</div>
                <div style="width: 250px;line-height: 32px" class="text-truncate" :title="job.material.bin">存储BIN位:{{job.material.bin}}</div>
            </v-card>
        </v-card>
        <v-data-table
                :loading="loadingGetJobs"
                :headers="headers1 "
                :items="jobs"
                :loading-text="loadingText"
                class="elevation-1 px-4 pb-4 my-4">
            <template v-slot:top>
                <v-row align="center" justify="start">
                    <v-col cols="2">
                        <div class="display-2">已排程列表</div>
                    </v-col>
                    <v-spacer/>
                    <v-btn @click="downloadMachineJobs">
                        <v-icon left>mdi-download</v-icon>
                        导出
                    </v-btn>
                </v-row>
            </template>
            <template v-slot:item.total="{ item }">
                {{item.mission.count*item.material.quantity}}
            </template>
            <template v-slot:item.gears="{ item }">
                {{gearsDictionary[item.material.gears]}}
            </template>
            <template v-slot:item.dish="{ item }">
                {{dishDictionary[item.material.dish]}}
            </template>
            <template v-slot:item.action="{ item }">
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
                :loading="loading"
                :headers="headers"
                :items="items"
                hide-default-footer
                :loading-text="loadingText"
                class="elevation-1 px-4 pb-4">
            <template v-slot:top>
                <v-row align="center" justify="start">
                    <v-col cols="2">
                        <div class="display-2">未排程列表</div>
                    </v-col>
                    <v-spacer/>
                    <v-btn @click="downloadAllJobs" :loading="isDownloadAllJobs">
                        <v-icon left>mdi-download</v-icon>
                        导出
                    </v-btn>
                </v-row>
            </template>

            <template v-slot:item.total="{ item }">
                {{item.mission.count*item.material.quantity}}
            </template>
            <template v-slot:item.state="{ item }">
                {{getJobState(item)}}
            </template>
            <template v-slot:item.gears="{ item }">
                {{gearsDictionary[item.material.gears]}}
            </template>
            <template v-slot:item.updatedOn="{ item }">
                {{item.updatedOn|formatTime('YYYY-MM-DD HH:mm')}}
            </template>
            <template v-slot:item.dish="{ item }">
                {{dishDictionary[item.material.dish]}}
            </template>
            <template v-slot:item.action="{ item }">
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
                runtimeJobSetStatusMap:{
                    0:'未设置',
                    1:'正在设置',
                    2:'已设置',
                },
                headers1: [
                    {text: '任务Id', sortable: false, value: 'jobId'},
                    {text: '包装总数', sortable: false, value: 'total'},
                    {text: '包数', sortable: false, value: 'mission.count'},
                    {text: '定额数量', sortable: false, value: 'material.quantity'},
                    {text: '挡位', sortable: false, value: 'gears'},
                    {text: '盘号', sortable: false, value: 'dish'},
                    {text: '指派员工', sortable: false, value: 'workName'},
                    {text: '生产站位', sortable: false, value: 'material.position'},
                    {text: '代换新号', sortable: false, value: 'material.replace'},
                    {text: '原定额代换', sortable: false, value: 'material.original'},
                    {text: '存储区域', sortable: false, value: 'material.store'},
                    {text: '存储BIN位', sortable: false, value: 'material.bin'},
                    {text: '物料号', sortable: false, value: 'material.materialCode'},
                    {text: 'AO工序号', sortable: false, value: 'material.aoCode'},
                    {text: '操作', sortable: false, value: 'action'},
                ],
                headers: [
                    {text: '任务Id', sortable: false, value: 'jobId'},
                    {text: '包装总数', sortable: false, value: 'total'},
                    {text: '包数', sortable: false, value: 'mission.count'},
                    {text: '定额数量', sortable: false, value: 'material.quantity'},
                    {text: '挡位', sortable: false, value: 'gears'},
                    {text: '盘号', sortable: false, value: 'dish'},
                    {text: '指派员工', sortable: false, value: 'workName'},
                    {text: '生产站位', sortable: false, value: 'material.position'},
                    {text: '代换新号', sortable: false, value: 'material.replace'},
                    {text: '原定额代换', sortable: false, value: 'material.original'},
                    {text: '存储区域', sortable: false, value: 'material.store'},
                    {text: '存储BIN位', sortable: false, value: 'material.bin'},
                    {text: '物料号', sortable: false, value: 'material.materialCode'},
                    {text: 'AO工序号', sortable: false, value: 'material.aoCode'},
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
                const tHeader = ['包装总数','包数','定额数量','挡位','盘号','指派员工','生产站位','代换新号','原定额代换','存储区域','存储BIN位','物料号','AO工序号']
                const filterVal = ['total','count','quantity','gears','dish','workName','position','replace','original','store','bin','materialCode','aoCode']
                const list = this.jobs.map(v=>{
                    return {
                        'count':v.mission.count,
                        'quantity':v.material.quantity,
                        'gears':this.gearsDictionary[v.material.gears],
                        'dish':this.dishDictionary[v.material.dish],
                        'workName':v.workName,
                        'position':v.material.position,
                        'replace':v.material.replace,
                        'original':v.material.original,
                        'store':v.material.store,
                        'bin':v.material.bin,
                        'materialCode':v.material.materialCode,
                        'aoCode':v.material.aoCode,
                        'total':v.mission.count*v.material.quantity
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
                        const tHeader = ['包装总数','包数','定额数量','挡位','盘号','指派员工','生产站位','代换新号','原定额代换','存储区域','存储BIN位','物料号','AO工序号']
                        const filterVal = ['total','count','quantity','gears','dish','workName','position','replace','original','store','bin','materialCode','aoCode']
                        const list = v.data.items.map(v=>{
                            return {
                                'count':v.mission.count,
                                'quantity':v.material.quantity,
                                'gears':this.gearsDictionary[v.material.gears],
                                'dish':this.dishDictionary[v.material.dish],
                                'workName':v.workName,
                                'position':v.material.position,
                                'replace':v.material.replace,
                                'original':v.material.original,
                                'store':v.material.store,
                                'bin':v.material.bin,
                                'materialCode':v.material.materialCode,
                                'aoCode':v.material.aoCode,
                                'total':v.mission.count*v.material.quantity
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
            getJobState(item){
                if(item['isError']){
                    return item['errorMessages'].join("，")
                }else{
                    if(item.jobStatus==="SCHEDULER"){
                        return "已排程"
                    }else{
                        return "未排程"
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>