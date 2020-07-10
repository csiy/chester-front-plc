<template>
    <v-card :loading="loading">
        <v-card-title>
            <span class="headline">修改物料</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-form ref="form" v-model="valid">
                    <v-row>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field clearable v-model.trim="material.materialCode" :rules="[rules.materialCode]" label="请输入物料号" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field clearable v-model.trim="material.aoCode" :rules="[rules.aoCode]" label="请输入AO工序号" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-select v-model.trim="material.gears" :rules="[rules.role]" :items="gearsList" item-text="name" item-value="value" label="请选择挡位" required/>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-select v-model.trim="material.dish" :rules="[rules.role]" :items="dishList" item-text="name" item-value="value" label="请选择盘号" required/>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field clearable v-model.trim="material.quantity" :rules="[rules.quantity]" label="请输入定额数量" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field clearable v-model.trim="material.position" :rules="[rules.position]" label="请输入生产站位" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field clearable v-model.trim="material.replace" :rules="[rules.replace]" label="请输入代换新号" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field clearable v-model.trim="material.original" :rules="[rules.original]" label="请输入原定额代换" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field clearable v-model.trim="material.store" :rules="[rules.store]" label="请输入存储区域" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field clearable v-model.trim="material.bin" :rules="[rules.bin]" label="请输入存储BIN位" required></v-text-field>
                        </v-col>
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
    import MaterialApi from "../../api/plc/MaterialApi";

    export default {
        name: "DialogUpdateMaterial",
        props:['item'],
        created() {
            this.material = {...this.item};
        },
        data() {
            return {
                valid: true,
                material: {
                    materialCode: null,
                    gears: 'ONE',
                    dish: 'LARGE',
                    quantity: null,
                    aoCode: null,
                    position: null,
                    replace: null,
                    original: null,
                    store: null,
                    bin: null
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
                    materialCode: (v) => v!=null||'请输入物料名称',
                    gears: (v) => v!=null||'请选择挡位',
                    dish: (v) => v!=null||'请选择盘号',
                    quantity: (v) => /^[1-9]\d*$/.test(v)&&v<100000000||'请输入定额数量',
                    aoCode: (v) => v!=null||'请输入AO工序号',
                    position: (v) => v!=null||'请输入生产站位',
                    replace: (v) => v!=null||'请输入代换新号',
                    original: (v) => v!=null||'请输入原定额代换',
                    store: (v) => v!=null||'请输入存储区域',
                    bin: (v) => v!=null||'请输入存储BIN位',
                },
            }
        },
        methods: {
            submit(){
                if(this.$refs.form.validate()){
                    if(!this.loading){
                        this.loading = true;
                        MaterialApi.materialUpdate(this.material).then(()=>{
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