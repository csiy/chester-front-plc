<template>
    <v-container fluid>
        <v-data-table
                :loading="loading"
                :headers="headers"
                :items="roles"
                :loading-text="loadingText"
                class="elevation-1 px-4 pb-4">
            <template v-slot:top>
                <v-row align="center" justify="start">
                    <v-spacer/>
                    <v-btn @click="plusItem" color="orange darken-2" class="mt-4">
                        <v-icon left>mdi-plus-outline</v-icon>
                        添加
                    </v-btn>
                </v-row>
            </template>
            <template v-slot:item.action="{ item }">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" icon color="blue-grey lighten-1" @click="editItem(item)">
                            <v-icon>mdi-playlist-edit</v-icon>
                        </v-btn>
                    </template>
                    <span>配置菜单</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn :disabled="!item.modify" v-on="on" icon color="blue-grey lighten-1" @click="deleteItem(item)">
                            <v-icon>mdi-delete-forever-outline</v-icon>
                        </v-btn>
                    </template>
                    <span>删除</span>
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
    import RoleApi from "../../api/sys/RoleApi";
    import DialogPlusRole from "../../dialogs/user/DialogPlusRole";
    import DialogEditRole from "../../dialogs/user/DialogEditRole";
    import RuleApi from "../../api/sys/RuleApi";
    import MenuApi from "../../api/sys/MenuApi";

    export default {
        name: "Role",
        mounted() {
            this.search();
        },
        data() {
            return {
                headers: [
                    {text: '角色key', sortable: false, value: 'name',},
                    {text: '角色名', sortable: false, value: 'remark',},
                    {text: '操作', sortable: false, value: 'action',width:200},
                ],
                loading: false,
                loadingText: '正在请求数据',
                items: [],
            }
        },
        computed: {
            ...mapState('user', ['roles']),
        },
        methods: {
            ...mapMutations('user',['setRoles','setMenus']),
            plusItem() {
                this.$dialog.show(DialogPlusRole, {
                    waitForResult: true,//等待弹出框返回值
                }).then((v) => {
                    console.log(v)
                    if (v) {
                        this.search();
                    }
                })
            },
            async editItem(item){
                console.log(this.menus)
                let rules = (await RuleApi.getRules().catch(v=>this.loading = false)).data;
                let menus = (await MenuApi.getModifyMenus().catch(v=>this.loading = false)).data;
                console.log(rules)
                this.$dialog.show(DialogEditRole, {
                    role:item.name,
                    menus,
                    rules,
                    transition:'dialog-bottom-transition',
                    width:900,
                    waitForResult: true,//等待弹出框返回值
                }).then((v) => {
                    if (v) {
                        MenuApi.userMenus().then(v=>{
                            this.setMenus(v.data);
                        });
                    }
                })
            },
            async deleteItem(item) {
                let res = await this.$dialog.confirm({
                    text: `确认要删除角色${item.name}吗？改删除并不能删除用户权限。恢复角色选项重新创建即可`,
                    title: '删除角色'
                })
                if (res) {
                    RoleApi.deleteRole(item.userId).then(() => {
                        this.search();
                    });
                }
            },
            async search() {
                if (!this.loading) {
                    this.loading = true;
                    let roles = (await RoleApi.getRoles().catch(v=>this.loading = false)).data;
                    this.setRoles(roles);
                    this.loading = false;
                }
            }
        }
    }
</script>

<style scoped>

</style>