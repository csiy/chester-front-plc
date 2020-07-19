<template>
    <v-card :loading="loading">
        <v-card-title>
            <span class="headline">添加机器</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-form ref="form" v-model="valid">
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field clearable v-model.trim="item.address" :rules="[rules.address]" label="请输入位置" required></v-text-field>
                        </v-col>
                        <template v-for="(v,index) in item.machineDishList">
                            <v-col cols="4">
                                {{index+1}}号盘
                            </v-col>
                            <v-col cols="4">
                                <v-select v-model.trim="v.gears" :rules="[rules.gears]" :items="gearsList" item-text="name" item-value="value" label="请选择挡位" required/>
                            </v-col>
                            <v-col cols="4">
                                <v-select v-model.trim="v.dish" :rules="[rules.dish]" :items="dishList" item-text="name" item-value="value" label="请选择盘号" required/>
                            </v-col>
                            <v-col cols="2" v-if="index+1===item.machineDishList.length">
                                <v-btn color="success darken-1" fab x-small dark @click="plus"><v-icon>mdi-plus</v-icon></v-btn>
                            </v-col>
                            <v-col cols="2" v-else>
                                <v-btn color="pink darken-1" fab x-small dark @click="minus(index)"><v-icon>mdi-minus</v-icon></v-btn>
                            </v-col>
                        </template>
                    </v-row>
                </v-form>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="success darken-1" @click="submit">创建</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import MachineApi from "../../api/plc/MachineApi";

    export default {
        name: "DialogPlusMachine",
        created() {
            this.plus();
        },
        data() {
            return {
                valid: true,
                item: {
                    address: null,
                    machineDishList: [],
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
                this.item.machineDishList.push({
                    gears: 'ONE',
                    dish: 'LARGE'
                })
            },
            minus(index){
                this.item.machineDishList.splice(index,1)
            },
            submit(){
                if(this.$refs.form.validate()){
                    if(!this.loading){
                        this.loading = true;
                        MachineApi.machinePlus(this.item).then(()=>{
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