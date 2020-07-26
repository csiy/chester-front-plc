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
                        <template v-for="(v,index) in machine.machineDishList">
                            <v-col cols="1" class="d-flex justify-center align-center">
                                {{numbers[index]}}
                            </v-col>
                            <v-col cols="5">
                                <v-select v-model.trim="v.gears" :rules="[rules.gears]" :items="gearsList" item-text="name" item-value="value" label="请选择挡位" required/>
                            </v-col>
                            <v-col cols="5">
                                <v-select v-model.trim="v.dish" :rules="[rules.dish]" :items="dishList" item-text="name" item-value="value" label="请选择盘号" required/>
                            </v-col>
                            <v-col cols="1" v-if="index+1===machine.machineDishList.length&&index+1<numbers.length">
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
            if(this.item.machineDishList.length>0){
                this.machine.machineDishList = [...this.item.machineDishList]
            }
        },
        data() {
            return {
                valid: true,
                numbers: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
                machine: {
                    address: null,
                    machineDishList: [{
                        gears:null,
                        dish:null
                    }],
                    params: null,
                },
                dishList: [
                    {
                        value: 'LARGE',
                        name: '大'
                    },
                    {
                        value: 'NORMAL',
                        name: '中'
                    },
                    {
                        value: 'SMALL',
                        name: '小'
                    },
                ],
                gearsList: [
                    {
                        value: 'ONE',
                        name: '1'
                    },
                    {
                        value: 'TWO',
                        name: '2'
                    },
                    {
                        value: 'THREE',
                        name: '3'
                    }
                ],
                loading:false,
                rules: {
                    address: (v) => v!=null||'请输入位置',
                    gears: (v) => v!=null||'请选择挡位',
                    dish: (v) => v!=null||'请选择盘号',
                },
            }
        },
        methods: {
            plus(){
                this.machine.machineDishList.push({
                    gears: 'ONE',
                    dish: 'LARGE'
                })
            },
            minus(index){
                this.machine.machineDishList.splice(index,1)
            },
            submit(){
                if(this.$refs.form.validate()){
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