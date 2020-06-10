<template>
    <v-container fluid>
        <v-data-table
                :loading="loading"
                :headers="headers"
                :items="items"
                :loading-text="loadingText"
                class="elevation-1 px-4 pb-4">
            <template v-slot:item.roles="{ item }">
                {{item.roles.map(v=>roleMap[v]||v).join(',')}}
            </template>
            <template v-slot:item.action="{ item }">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn :disabled="!item.modify" v-on="on" icon color="blue-grey lighten-1" @click="editItem(item)">
                            <v-icon>mdi-border-color</v-icon>
                        </v-btn>
                    </template>
                    <span>编辑</span>
                </v-tooltip>
            </template>
            <template v-slot:no-data>
                未查询到数据
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
    import {
        mapMutations, mapState,
    } from 'vuex'
    import RuleApi from "../../api/sys/RuleApi";
    import DialogEditRule from "../../dialogs/user/DialogEditRule";

    export default {
        name: "Rule",
        mounted() {
            this.search();
        },
        data() {
            return {
                headers: [
                    {text: '说明', sortable: false, value: 'remark',width:200},
                    {text: '模块', sortable: true, value: 'model',width:150},
                    {text: '请求路径', sortable: true, value: 'path',width:100},
                    {text: '请求方式', sortable: true, value: 'type',width:150},
                    {text: '角色', sortable: false, value: 'roles',width:300},
                    {text: '操作', sortable: false, value: 'action',width:100},
                ],
                loading: false,
                loadingText: '正在请求数据',
                items: [],
            }
        },
        computed: {
            ...mapState('user', ['roles']),
            roleMap(){
                let map = {};
                this.roles.forEach(v=>{
                    map[v.name] = v.remark;
                });
                return map;
            },
        },
        methods: {
            editItem(item) {
                this.$dialog.show(DialogEditRule, {
                    val:item.roles,
                    ruleId:item.ruleId,
                    roles:this.roles,
                    waitForResult: true,//等待弹出框返回值
                }).then((v) => {
                    console.log(v)
                    if (v) {
                        this.search();
                    }
                })
            },
            search() {
                if (!this.loading) {
                    this.loading = true;
                    RuleApi.getRules().then(v => {
                        this.items = v.data;
                    }).finally(() => {
                        this.loading = false;
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>