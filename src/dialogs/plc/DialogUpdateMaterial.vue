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
                            <v-text-field clearable v-model.trim="material.disk" :rules="[rules.disk]" label="请输入盘号" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field clearable v-model.trim="material.quantity" :rules="[rules.quantity]" label="请输入定额数量" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field clearable v-model.trim="material.position" :rules="[rules.position]" label="请输入生产站位" required></v-text-field>
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
                    disk: null,
                    quantity: null,
                    aoCode: null,
                    position: null
                },
                loading:false,
                rules: {
                    materialCode: (v) => v!=null||'请输入物料名称',
                    disk: (v) => v!=null||'请选择盘号',
                    quantity: (v) => /^[1-9]\d*$/.test(v)&&v<100000000||'请输入定额数量',
                    aoCode: (v) => v!=null||'请输入AO工序号',
                    position: (v) => v!=null||'请输入生产站位'
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