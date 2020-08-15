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
                        <template v-for="(val,index) in machine.diskList">
                            <v-col cols="10">
                                <v-text-field clearable v-model.trim="machine.diskList[index]" :rules="[rules.dish]" label="请输入盘号" required></v-text-field>
                            </v-col>
                            <v-col cols="1" v-if="index+1===machine.diskList.length&&index+1<numbers.length">
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
            if(this.item.diskList.length>0){
                this.machine.diskList = [...this.item.diskList]
            }
        },
        data() {
            return {
                valid: true,
                numbers: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
                machine: {
                    address: null,
                    diskList: [null],
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
                this.machine.diskList.push(null)
            },
            minus(index){
                this.machine.diskList.splice(index,1)
            },
            submit(){
                if(this.$refs.form.validate()){
                    if(this.machine.diskList.filter(v=>v===null).length>0){
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