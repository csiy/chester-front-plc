<template>
    <v-card :loading="loading">
        <v-card-title>
            <span class="headline">修改任务</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-form ref="form" v-model="valid">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field clearable v-model.trim="mission.materialCode" :rules="[rules.materialCode]" label="请输入物料号" required></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field clearable v-model.trim="mission.aoCode" :rules="[rules.aoCode]" label="请输入AO工序号" required></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field clearable v-model.trim="mission.count" :rules="[rules.count]" label="请输入包装数量" required></v-text-field>
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
    import MissionApi from "../../api/plc/MissionApi";

    export default {
        name: "DialogUpdateMission",
        props:['item'],
        created() {
            this.mission = {...this.item};
        },
        data() {
            return {
                valid: true,
                dateMenu: false,
                timeMenu: false,
                mission: {
                    materialCode: null,
                    aoCode: null,
                    count: null,
                },
                loading:false,
                rules: {
                    materialCode: (v) => v!=null||'请输入物料名称',
                    aoCode: (v) => v!=null||'请输入AO工序号',
                    count: (v) => /^[1-9]\d*$/.test(v)&&v<100000000||'请输入包装数量',
                },
            }
        },
        methods: {
            submit(){
                if(this.$refs.form.validate()){
                    if(!this.loading){
                        this.loading = true;
                        MissionApi.missionUpdate(this.mission).then(()=>{
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