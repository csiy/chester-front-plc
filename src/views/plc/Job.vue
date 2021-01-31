<template>
    <v-container fluid>
        <v-card :loading="loadingMachines" class="pb-4">
            <v-slide-group v-model="machineNum" class="pa-4" mandatory show-arrows>
                <template v-for="machine in machines" v-if="machine.disks&&machine.disks.length>0">
                    <v-slide-item @click.native="changeMachineOrDisk(machine,disk)" v-for="disk in machine.disks" :key="machine.machineId+''+disk.name" v-slot:default="{ active, toggle }">
                        <v-card :color="active ? 'primary' : 'grey lighten-3'" :dark="active" class="mr-4 pa-2" height="100" width="150" @click="toggle">
                            <div>设备:{{machine.machineId}}</div>
                            <div>盘号:{{disk.name}}</div>
                            <div class="d-flex text-center align-center">
                                当前任务：
                            </div>
                            <v-sheet dark class="ml-2 lighten-1 px-1" :color="machine.linkState?'orange':'teal'">
                                {{disk.missionId?disk.missionId:'未排程'}}
                            </v-sheet>
                        </v-card>
                    </v-slide-item>
                </template>
            </v-slide-group>
            <v-divider/>
            <v-card elevation="0" class="d-flex justify-space-between pa-4">
                <v-btn color="orange" @click="stopMachine" v-if="disk.missionId">结束</v-btn>
                <v-btn color="orange" @click="startMachine" v-else>开始</v-btn>
            </v-card>
            <v-divider/>
            <v-card elevation="0" v-if="mission" class="d-flex justify-start flex-wrap pa-4">
                <div style="width: 250px;line-height: 32px" class="text-truncate" :title="mission.count*mission.quantity">包装总数:{{mission.count*mission.quantity}}</div>
                <div style="width: 250px;line-height: 32px" class="text-truncate" :title="mission.quantity">包数:{{mission.count}}</div>
                <div style="width: 250px;line-height: 32px" class="text-truncate" :title="mission.quantity">定额数量:{{mission.quantity}}</div>
                <div style="width: 250px;line-height: 32px" class="text-truncate" :title="mission.materialCode">物料号:{{mission.materialCode}}</div>
                <div style="width: 250px;line-height: 32px" class="text-truncate" :title="mission.aoCode">AO工序号:{{mission.aoCode}}</div>
                <div style="width: 250px;line-height: 32px" class="text-truncate" :title="mission.disk">盘号:{{mission.disk}}</div>
                <div style="width: 250px;line-height: 32px" class="text-truncate" :title="mission.position">生产站位:{{mission.position}}</div>
                <div style="width: 250px;line-height: 32px" class="text-truncate" :title="mission.bin">存储BIN位:{{mission.bin}}</div>
            </v-card>
        </v-card>
        <SchedulerJobs v-if="disk" :machine-id="machine.machineId" :disk="disk" :search-action="schedulerMissionPages" title="已排程列表"></SchedulerJobs>
        <SchedulerJobs :search-action="unSchedulerMissionPages" title="未排程列表"></SchedulerJobs>
    </v-container>
</template>

<script>

    import MachineApi from "../../api/plc/MachineApi";
    import SchedulerJobs from "./SchedulerJobs";
    import MissionApi from '../../api/plc/MissionApi';

    export default {
        name: "Job",
        components: {SchedulerJobs},
        mounted() {
            this.getMachineAll();
            this.interval = setInterval(this.getMachineAll,100000)
        },
        data() {
            return {
                disk: null,
                schedulerMissionPages:MissionApi.schedulerMissionPages,
                unSchedulerMissionPages:MissionApi.unSchedulerMissionPages,
                interval: null,
                machine: {},
                mission: {},
                machineNum: null,
                machines:[],
                loadingMachines:false,
                diskNum:0,
            }
        },
        destroyed(){
            if(this.interval){
                clearInterval(this.interval)
            }
        },
        methods:{
            changeMachineOrDisk(machine,disk){
                this.machine = machine;
                this.disk = disk;
                this.diskNum = this.machine.disks.indexOf(this.disk);
                if(this.disk.missionId){
                    MissionApi.getMission(this.disk.missionId).then(v=>{
                        this.mission = v;
                    })
                }else{
                    this.mission = null;
                }
            },
            async startMachine() {
                if (this.machine.machineId) {
                    let res = await this.$dialog.confirm({
                        text: `请检查挡位是否正确，上料是否完毕？`,
                        title: '开始'
                    })
                    if(res){
                        MachineApi.machineStart(this.machine.machineId,this.diskNum).then(v => {
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
                        MachineApi.machineStop(this.machine.machineId, this.diskNum).then(v => {
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
                            if(this.machineNum===null||this.machineNum===0){
                                this.machineNum = 0;
                                let machine = this.machines[0];
                                if(machine.disks.length>0){
                                    this.changeMachineOrDisk(machine,machine.disks[0]);
                                }
                            }
                        }
                    })
                }
            },
        }
    }
</script>

<style scoped>

</style>
