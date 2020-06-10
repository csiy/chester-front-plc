<template>
    <v-card :loading="loading">
        <v-card-title>
            <span class="headline">添加角色</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-form ref="form" v-model="valid">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field clearable v-model.trim="val.name" :rules="[rules.roleKey]" label="角色Key" required></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field clearable v-model.trim="val.remark" :rules="[rules.roleName]" label="角色名" required></v-text-field>
                        </v-col>
                    </v-row>
                </v-form>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="success darken-1" @click="userPlus">创建</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import Rules from "../../rules/rules";
    import RoleApi from "../../api/sys/RoleApi";

    export default {
        name: "DialogPlusRole",
        props: ["roles"],
        data() {
            return {
                valid: true,
                val: {
                    name: null,
                    remark: null,
                },
                rules: {
                    ...Rules
                },
                loading:false,
            }
        },
        methods: {
            userPlus() {
                if(this.$refs.form.validate()){
                    if(!this.loading){
                        this.loading = true;
                        RoleApi.plusRole(this.val).then(()=>{
                            this.$emit('submit', true);//返回值，并关闭对话框
                        }).finally(()=>{
                            this.loading = false;
                        })
                    }
                }
            },
        },
    }
</script>

<style scoped>

</style>