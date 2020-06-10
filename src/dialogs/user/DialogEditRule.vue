<template>
    <v-card :loading="loading">
        <v-card-title>
            <span class="headline">修改权限</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-form ref="form" v-model="valid">
                    <v-row>
                        <v-col cols="12">
                            <v-select required clearable multiple v-model.trim="v" :rules="[rules.role]" :items="roles" item-text="remark" item-value="name" label="请选择角色"/>
                        </v-col>
                    </v-row>
                </v-form>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="success darken-1" @click="userPlus">修改</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import Rules from "../../rules/rules";
    import RuleApi from "../../api/sys/RuleApi";

    export default {
        name: "DialogEditRule",
        props: ["roles","val","ruleId"],
        created() {
            this.v = [...this.val];
        },
        data() {
            return {
                valid: true,
                v:[],
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
                        RuleApi.updateRule({ruleId:this.ruleId,roles:this.v}).then(()=>{
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