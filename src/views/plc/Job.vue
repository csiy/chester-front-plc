<template>
    <v-container fluid>
        <v-row>
            <v-col cols="6">
                <v-card :loading="loadingMachines" class="pb-4">
                    <v-slide-group v-model="machineNum" class="pa-4" mandatory show-arrows>
                        <v-slide-item v-for="item in machines" :key="item.machineId" v-slot:default="{ active, toggle }">
                            <v-card :color="active ? 'primary' : 'grey lighten-3'" :dark="active" class="ma-4 pa-2" height="100" width="150" @click="toggle">
                                <div>设备:{{item.machineId}}</div>
                                <div class="d-flex text-center align-center">状态:<v-sheet dark class="ml-2 lighten-1 px-1" :color="item.linkState?'orange':'teal'">{{item.linkState?'已链接':'未链接'}}</v-sheet></div>
                                <div>当前盘号:{{item.runtimeDishNumber===-1?"未设置":item.runtimeDishNumber}}</div>
                                <div>当前盘:{{!item.runtimeDish?"未设置":dishDictionary[item.runtimeDish.dish]+'盘'+gearsDictionary[item.runtimeDish.gears]+'挡'}}</div>
                            </v-card>
                        </v-slide-item>
                    </v-slide-group>
                    <v-card elevation="4" class="d-flex justify-space-between px-8 py-2 mx-10">
                        <div class="pa-2 d-flex align-center">
                            <div class="text-center d-flex"><v-sheet>当前设备：</v-sheet><v-sheet width="100" dark class="orange lighten-1">{{machine.machineId}}</v-sheet></div>
                            <div class="text-center d-flex ml-4"><v-sheet>运行状态：</v-sheet><v-sheet width="100" dark class="teal lighten-1">{{machine.runState?'已经运行':'未运行'}}</v-sheet></div>
                        </div>
                        <div class="pa-2 d-flex">
                            <v-btn icon v-if="machine.linkState">
                                <v-icon color="orange" @click="stopMachine" v-if="machine.runState">mdi-stop-circle-outline</v-icon>
                                <v-icon color="primary" v-else @click="startMachine">mdi-play-circle-outline</v-icon>
                            </v-btn>
<!--                            <v-btn icon v-if="machine.linkState&&!machine.runState&&machine.jobs&&machine.jobs.length>0">-->
<!--                                <v-icon color="light-green" @click="nextJob">mdi-skip-next-outline</v-icon>-->
<!--                            </v-btn>-->
                        </div>
                    </v-card>
                    <v-card elevation="4" :loading="loadingGetJob" v-if="job" class="d-flex justify-start flex-wrap px-8 py-2 mx-10 my-4">
                        <div style="width: 200px" class="text-truncate" :title="job.material.quantity">包装数量:{{job.mission.count}}</div>
                        <div style="width: 200px" class="text-truncate" :title="job.material.quantity">定额数量:{{job.material.quantity}}</div>
                        <div style="width: 200px" class="text-truncate" :title="job.material.materialCode">物料号:{{job.material.materialCode}}</div>
                        <div style="width: 200px" class="text-truncate" :title="job.material.aoCode">AO工序号:{{job.material.aoCode}}</div>
                        <div style="width: 200px" class="text-truncate" :title="job.material.gears">挡位:{{job.material.gears}}</div>
                        <div style="width: 200px" class="text-truncate" :title="job.material.dish">盘号:{{job.material.dish}}</div>
                        <div style="width: 200px" class="text-truncate" :title="job.material.position">生产站位:{{job.material.position}}</div>
                        <div style="width: 200px" class="text-truncate" :title="job.material.store">存储区域:{{job.material.store}}</div>
                        <div style="width: 200px" class="text-truncate" :title="job.material.bin">存储BIN位:{{job.material.bin}}</div>
                    </v-card>
                </v-card>
                <v-data-table
                        :loading="loadingGetJobs"
                        :headers="headers"
                        :items="jobs"
                        :loading-text="loadingText"
                        class="elevation-1 px-4 pb-4 mt-4">
                    <template v-slot:top>
                        <div class="pa-8 display-2">已排程列表</div>
                    </template>
                    <template v-slot:item.state="{ item }">
                        {{getJobState(item)}}
                    </template>
                    <template v-slot:item.updatedOn="{ item }">
                        {{item.updatedOn|formatTime('YYYY-MM-DD HH:mm')}}
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
            </v-col>
            <v-col cols="6">
                <v-data-table
                        :loading="loading"
                        :headers="headers"
                        :items="items"
                        hide-default-footer
                        :loading-text="loadingText"
                        class="elevation-1 px-4 pb-4">
                    <template v-slot:top>
                        <div class="pa-8 display-2">未排程列表</div>
                    </template>
                    <template v-slot:item.state="{ item }">
                        {{getJobState(item)}}
                    </template>
                    <template v-slot:item.updatedOn="{ item }">
                        {{item.updatedOn|formatTime('YYYY-MM-DD HH:mm')}}
                    </template>
                    <template v-slot:item.action="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn v-on="on" icon color="blue-grey lighten-1" class="mr-2" @click="updateItem(item)">
                                    <v-icon>mdi-cog-outline</v-icon>
                                </v-btn>
                            </template>
                            <span>修改</span>
                        </v-tooltip>
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
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import TablePageMixins from "../../mixins/TablePageMixins";
    import DictionaryMixins from "../../mixins/DictionaryMixins";
    import JobApi from "../../api/plc/JobApi";
    import MachineApi from "../../api/plc/MachineApi";

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
                headers: [
                    {text: '包装数量', sortable: false, value: 'mission.count',width:150},
                    {text: '需求日期', sortable: false, value: 'mission.date',width:150},
                    {text: '需求时间', sortable: false, value: 'mission.time',width:150},
                    {text: '物料号', sortable: false, value: 'material.materialCode',width:150},
                    {text: '挡位', sortable: false, value: 'material.gears',width:150},
                    {text: '盘号', sortable: false, value: 'material.dish',width:150},
                    {text: '定额数量', sortable: false, value: 'material.quantity',width:150},
                    {text: 'AO工序号', sortable: false, value: 'material.aoCode',width:150},
                    {text: '生产站位', sortable: false, value: 'material.position',width:150},
                    {text: '代换新号', sortable: false, value: 'material.replace',width:150},
                    {text: '原定额代换', sortable: false, value: 'material.original',width:150},
                    {text: '存储区域', sortable: false, value: 'material.store',width:150},
                    {text: '存储BIN位', sortable: false, value: 'material.bin',width:150},
                    {text: '状态', sortable: false, value: 'state',width:200},
                    {text: '操作时间', sortable: false, value: 'updatedOn',width:150},
                    {text: '操作人', sortable: false, value: 'updatedName',width:100},
                    {text: '操作', sortable: false, value: 'action',width:150},
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
            startMachine(){
                if(this.machines.length>0){
                    let machine = this.machine;
                    MachineApi.machineStart(machine.machineId,machine.version).then(v=>{
                        this.getMachineAll();
                    })
                }
            },
            stopMachine(){
                if(this.machines.length>0){
                    let machine = this.machine;
                    MachineApi.machineStop(machine.machineId,machine.version).then(v=>{
                        this.getMachineAll();
                    })
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
                            jobs.push(v.data.filter(v=>v.jobId===this.machine.jobs[i])[0])
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