<template>
    <v-card :loading="loading">
        <v-card-title>
            <span class="headline">修改机器</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-form ref="form" v-model="valid">
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field clearable v-model.trim="machine.address" :rules="[rules.address]" label="请输入位置" required></v-text-field>
                        </v-col>
                        <template v-for="(disk,index) in machine.disks">
                            <v-col cols="10">
                                <v-text-field clearable v-model.trim="disk.name" :rules="[rules.disk]" label="请输入盘号" required></v-text-field>
                            </v-col>
                            <v-col cols="1" v-if="index+1===machine.disks.length&&index+1<10">
                                <v-btn color="success darken-1" fab x-small dark @click="plus"><v-icon>mdi-plus</v-icon></v-btn>
                            </v-col>
                            <v-col cols="1" v-else>
                                <v-btn color="pink darken-1" fab x-small dark @click="minus(index)"><v-icon>mdi-minus</v-icon></v-btn>
                            </v-col>
                        </template>
                    </v-row>
                </v-form>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="success darken-1" @click="submit">修改</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import MachineApi from "../../api/plc/MachineApi";

    export default {
        name: "DialogUpdateMachine",
        props:['item'],
        created() {
            this.machine.machineId = this.item.machineId;
            this.machine.address = this.item.address;
            this.machine.version = this.item.version;
            if(this.item.disks.length>0){
                this.machine.disks = [...this.item.disks]
            }
        },
        data() {
            return {
                valid: true,
                machine: {
                    address: null,
                    disks: [{
                        name:null,
                        missionId: null,
                    }],
                    params: null,
                },
                loading:false,
                rules: {
                    address: (v) => v!=null||'请输入位置',
                    disk: (v) => v!=null||'请选择盘号',
                },
            }
        },
        methods: {
            plus(){
                this.machine.disks.push({})
            },
            minus(index){
                this.machine.disks.splice(index,1)
            },
            submit(){
                if(this.$refs.form.validate()){
                    if(this.machine.disks.filter(v=>v.name===null).length>0){
                        this.$message.warning("请输入盘号")
                        return
                    }
                    if(!this.loading){
                        this.loading = true;
                        MachineApi.machineUpdate(this.machine).then(()=>{
                            this.$emit('submit', true);//返回值，并关闭对话框
                        }).finally(()=>{
                            this.loading = false;
                        })
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>