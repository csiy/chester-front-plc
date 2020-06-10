<template>
    <v-card :loading="loading">
        <v-card-title>
            <span class="headline">添加用户</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-form ref="form" v-model="valid">
                    <v-row>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field clearable v-model.trim="user.phone" :rules="[rules.phone]" label="请输入手机号" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field clearable v-model.trim="user.name" :rules="[rules.name]" label="请输入姓名" required></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-select required clearable multiple v-model.trim="user.roles" :rules="[rules.role]" :items="roleList" item-text="remark" item-value="name" label="请选择角色"/>
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
    import UserApi from "../../api/sys/UserApi";
    import Rules from "../../rules/rules";

    export default {
        name: "DialogPlusUser",
        props: ["roles","major"],
        created() {
            this.roleList = this.roles.filter(v=>v.name!=='authed');
            this.user = {...this.major};
        },
        data() {
            return {
                valid: true,
                user: {
                    userId: null,
                    phone: null,
                    name: null,
                    roles: [],
                },
                roleList:[],
                loading:false,
                rules: {
                    ...Rules
                },
            }
        },
        methods: {
            userPlus() {
                if(this.$refs.form.validate()){
                    if(!this.loading){
                        this.loading = true;
                        UserApi.updateUser(this.user).then(()=>{
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