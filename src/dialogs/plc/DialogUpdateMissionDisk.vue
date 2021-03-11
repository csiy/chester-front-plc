<template>
    <v-card :loading="loading">
        <v-card-title>
            <span class="headline">修改任务盘</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-form ref="form" v-model="valid">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field clearable v-model.trim="mission.disk" :rules="[rules.disk]" label="请输入盘号" required></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field clearable v-model.trim="mission.highSpeed" :rules="[rules.highSpeed]" label="请输入高速率" required></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field clearable v-model.trim="mission.lowSpeed" :rules="[rules.lowSpeed]" label="请输入低速率" required></v-text-field>
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
        name: "DialogUpdateMissionDisk",
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
                    disk: null,
                },
                loading:false,
                rules: {
                    disk: (v) => v!=null||'请输入盘号',
                    highSpeed: (v) => v!=null||'请输入高速率',
                    lowSpeed: (v) => v!=null||'请输入低速率',
                },
            }
        },
        methods: {
            submit(){
                if(this.$refs.form.validate()){
                    if(!this.loading){
                        this.loading = true;
                        MissionApi.missionUpdateDisk(this.mission).then(()=>{
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