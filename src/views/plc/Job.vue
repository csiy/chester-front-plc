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
                    </div>
                </div>
                <div class="d-flex">
                    <v-btn icon v-if="machine.linkState&&machine.runtimeJob">
                        <v-icon color="orange" @click="stopMachine" v-if="machine.runState">mdi-stop-circle-outline</v-icon>
                        <v-icon color="primary" v-else @click="startMachine">mdi-play-circle-outline</v-icon>
                    </v-btn>
                    <!--                            <v-btn icon v-if="machine.linkState&&!machine.runState&&machine.jobs&&machine.jobs.length>0">-->
                    <!--                                <v-icon color="light-green" @click="nextJob">mdi-skip-next-outline</v-icon>-->
                    <!--                            </v-btn>-->
                </div>
            </v-card>
            <v-divider/>
            <v-card elevation="0" :loading="loadingGetJob" v-if="job" class="d-flex justify-start flex-wrap pa-4">
                <div style="width: 250px;line-height: 32px" class="text-truncate" :title="job.material.quantity">包装数量:{{job.mission.count}}</div>
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
            <template v-slot:item.gears="{ item }">
                {{gearsDictionary[item.material.gears]}}
            </template>
            <template v-slot:item.dish="{ item }">
                {{dishDictionary[item.material.dish]}}
            </template>
            <template v-slot:item.action="{ item }">
                <v-tooltip v-if="item.jobId!==jobs[0].jobId" bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" icon color="blue-grey lighten-1" class="mr-2" @click="upSort(item)">
                            <v-icon>mdi-upload</v-icon>
                        </v-btn>
                    </template>
                    <span>上移</span>
                </v-tooltip>
                <v-tooltip v-if="item.jobId!==jobs[jobs.length-1].jobId" bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" icon color="blue-grey lighten-1" @click="downSort(item)">
                            <v-icon>mdi-download</v-icon>
                        </v-btn>
                    </template>
                    <span>下移</span>
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
                        <v-btn v-on="on" icon color="blue-grey lighten-1" @click="deleteItem(item.machineId,item.version)">
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
                headers1: [
                    {text: '操作', sortable: false, value: 'action',width:140},
                    {text: '包装数量', sortable: false, value: 'mission.count',width:80},
                    {text: '定额数量', sortable: false, value: 'material.quantity',width:80},
                    {text: '挡位', sortable: false, value: 'gears',width:80},
                    {text: '盘号', sortable: false, value: 'dish',width:80},
                    {text: '指派员工', sortable: false, value: 'workName',width:120},
                    {text: '生产站位', sortable: false, value: 'material.position',width:120},
                    {text: '代换新号', sortable: false, value: 'material.replace',width:120},
                    {text: '原定额代换', sortable: false, value: 'material.original',width:120},
                    {text: '存储区域', sortable: false, value: 'material.store',width:120},
                    {text: '存储BIN位', sortable: false, value: 'material.bin',width:120},
                ],
                headers: [
                    {text: '操作', sortable: false, value: 'action',width:120},
                    {text: '包装数量', sortable: false, value: 'mission.count',width:80},
                    {text: '定额数量', sortable: false, value: 'material.quantity',width:80},
                    {text: '挡位', sortable: false, value: 'gears',width:80},
                    {text: '盘号', sortable: false, value: 'dish',width:80},
                    {text: '指派员工', sortable: false, value: 'workName',width:150},
                    {text: '生产站位', sortable: false, value: 'material.position',width:150},
                    {text: '代换新号', sortable: false, value: 'material.replace',width:150},
                    {text: '原定额代换', sortable: false, value: 'material.original',width:150},
                    {text: '存储区域', sortable: false, value: 'material.store',width:150},
                    {text: '存储BIN位', sortable: false, value: 'material.bin',width:150},
                    {text: '物料号', sortable: false, value: 'material.materialCode',width:150},
                    {text: 'AO工序号', sortable: false, value: 'material.aoCode',width:150},
                    {text: '状态', sortable: false, value: 'state',width:200},
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
                const tHeader = ['包装数量','定额数量','挡位','盘号','指派员工','生产站位','代换新号','原定额代换','存储区域','存储BIN位']
                const filterVal = ['count','quantity','gears','dish','workName','position','replace','original','store','bin']
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
                        'bin':v.material.bin
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
                        const tHeader = ['包装数量','定额数量','挡位','盘号','指派员工','生产站位','代换新号','原定额代换','存储区域','存储BIN位']
                        const filterVal = ['count','quantity','gears','dish','workName','position','replace','original','store','bin']
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
                                'bin':v.material.bin
                            }
                        })   //table数据
                        const data = this.formatJson(filterVal,list);
                        export_json_to_excel(tHeader,data,'未排程');  //导出文件名称
                    }).finally(()=>{
                        this.isDownloadAllJobs = false
                    })
                }

            },
            upSort(item){
                let machine = {
                    machineId:this.machine.machineId,
                    version: this.machine.version,
                    jobs: [...this.machine.jobs]
                };
                let index = machine.jobs.indexOf(item.jobId);
                let replaceIndex = index-1;
                machine.jobs.splice(index,1,...machine.jobs.splice(replaceIndex, 1 , machine.jobs[index]));
                MachineApi.reSort(machine).then(v=>{
                    this.getMachineAll();
                })
            },
            downSort(item){
                let machine = {
                    machineId:this.machine.machineId,
                    version: this.machine.version,
                    jobs: [...this.machine.jobs]
                };
                let index = machine.jobs.indexOf(item.jobId);
                let replaceIndex = index+1;
                machine.jobs.splice(index,1,...machine.jobs.splice(replaceIndex, 1 , machine.jobs[index]));
                MachineApi.reSort(machine).then(v=>{
                    this.getMachineAll();
                })
            },
            nextJob(){
                MachineApi.nextJob(this.machine.machineId,this.machine.jobs[0],this.machine.version).then(v=>{
                    this.getMachineAll();
                })
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
                if(!this.loadingGetJobs&&this.machine.jobs&&this.machine.jobs.length>0){
                    this.loadingGetJobs = true;
                    JobApi.getJobs(this.machine).then(v=>{
                        this.loadingGetJobs = false;
                        let jobs = [];
                        for(let i in this.machine.jobs){
                            let job = v.data.filter(v=>v.jobId===this.machine.jobs[i])[0];
                            jobs.push({
                                ...job,
                                gears:job.material.gears,
                                dish:job.material.dish
                            })
                        }
                        this.jobs = jobs;
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