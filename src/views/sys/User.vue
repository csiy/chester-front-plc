<template>
    <v-container fluid>
        <v-data-table
                :loading="loading"
                :headers="headers"
                :items="items"
                hide-default-footer
                :loading-text="loadingText"
                class="elevation-1 px-4 pb-4">
            <template v-slot:top>
                <v-row align="center" justify="start">
                    <v-col cols="2">
                        <v-text-field clearable v-model.trim="query.name" label="请输入用户名" hide-details/>
                    </v-col>
                    <v-col cols="2">
                        <v-text-field clearable v-model.trim="query.phone" label="请输入手机号" hide-details/>
                    </v-col>
                    <v-col cols="2">
                        <v-select clearable v-model="query.role" :items="roles" item-value="name" item-text="remark"
                                  label="请选择角色" hide-details/>
                    </v-col>
                    <v-col cols="2">
                        <v-btn small @click="search">
                            <v-icon left>mdi-magnify</v-icon>
                            搜索
                        </v-btn>
                    </v-col>
                    <v-spacer/>
                    <v-btn small @click="plusItem" color="orange darken-2">
                        <v-icon left>mdi-account-plus-outline</v-icon>
                        添加
                    </v-btn>
                </v-row>
            </template>
            <template v-slot:item.isDisabled="{ item }">
                {{item.isDisabled?"禁用":"启用"}}
            </template>
            <template v-slot:item.role="{ item }">
                {{item.roles.map(v=>roleMap[v]).join("，")}}
            </template>
            <template v-slot:item.action="{ item }">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" icon color="blue-grey lighten-1" class="mr-2" @click="updateUser(item)">
                            <v-icon>mdi-account-cog-outline</v-icon>
                        </v-btn>
                    </template>
                    <span>设置用户</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" icon color="blue-grey lighten-1" class="mr-2" @click="reSetPassword(item)">
                            <v-icon>mdi-shield-account-outline</v-icon>
                        </v-btn>
                    </template>
                    <span>重置密码</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" icon color="blue-grey lighten-1" class="mr-2" @click="disabledItem(item)">
                            <v-icon>{{!item.isDisabled?'mdi-account-cancel-outline':'mdi-account-check-outline'}}
                            </v-icon>
                        </v-btn>
                    </template>
                    <span>{{!item.isDisabled?'禁用':'启用'}}</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" icon color="blue-grey lighten-1" @click="deleteItem(item)">
                            <v-icon>mdi-delete-forever-outline</v-icon>
                        </v-btn>
                    </template>
                    <span>删除</span>
                </v-tooltip>
            </template>
            <template v-slot:no-data>
                未查询到数据
            </template>
            <template v-slot:footer v-if="pageCount">
                <v-divider/>
                <v-pagination class="mt-2" v-model="page.curPage" @input="search" :length="pageCount"
                              :total-visible="totalVisible"/>
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
    import {mapState,} from 'vuex'
    import UserApi from "../../api/sys/UserApi";
    import DialogPlusUser from "../../dialogs/user/DialogPlusUser";
    import DialogEditUser from "../../dialogs/user/DialogEditUser";

    export default {
        name: "User",
        mounted() {
            this.search();
        },
        data() {
            return {
                headers: [
                    {text: '用户ID', sortable: false, value: 'userId',},
                    {text: '用户姓名', sortable: false, value: 'name',},
                    {text: '手机号', sortable: false, value: 'phone',},
                    {text: '角色', sortable: false, value: 'role',},
                    {text: '性别', sortable: false, value: 'sex',},
                    {text: '状态', sortable: false, value: 'isDisabled'},
                    {text: '操作', sortable: false, value: 'action',},
                ],
                loading: false,
                loadingText: '正在请求数据',
                items: [],
                query: {
                    name: null,
                    phone: null,
                    role: null,
                },
                page: {
                    curPage: 1,
                    pageSize: 10,
                    total: 0,
                },
                totalVisible: 10,
            }
        },
        computed: {
            ...mapState('user', ['roles']),
            roleMap() {
                let map = {};
                this.roles.forEach(v => {
                    map[v.name] = v.remark;
                });
                return map;
            },
            pageCount() {
                return parseInt(this.page.total / this.page.pageSize) + ((this.page.total % this.page.pageSize) > 0 ? 1 : 0)
            }
        },
        methods: {
            plusItem() {
                this.$dialog.show(DialogPlusUser, {
                    roles: this.roles,
                    waitForResult: true,//等待弹出框返回值
                }).then((v) => {
                    console.log(v)
                    if (v) {
                        this.search();
                    }
                })
            },
            async updateUser(item) {
                this.$dialog.show(DialogEditUser, {
                    roles: this.roles,
                    major: item,
                    waitForResult: true,//等待弹出框返回值
                }).then((v) => {
                    if (v) {
                        this.search();
                    }
                })
            },
            async reSetPassword(item) {
                let res = await this.$dialog.confirm({
                    text: `确认要将用户${item.name}的密码重置吗？`,
                    title: '重置密码'
                })
                if (res) {
                    UserApi.reSetPassword(item.userId).then((v) => {
                        this.$dialog.confirm({
                            text: `用户新密码${v.data}`,
                            title: '重置密码成功'
                        });
                    });
                }
            },
            disabledItem(item) {
                UserApi.userDisabled(item.userId).then(() => {
                    this.search();
                });
            },
            async deleteItem(item) {
                let res = await this.$dialog.confirm({
                    text: `确认要删除用户${item.name}吗？删除后将无法恢复！`,
                    title: '删除用户'
                })
                if (res) {
                    UserApi.userDelete(item.userId).then(() => {
                        this.search();
                    });
                }
            },
            search() {
                if (!this.loading) {
                    this.loading = true;
                    UserApi.userPages(this.query, this.page).then(v => {
                        this.page = v.data.page;
                        this.items = v.data.items;
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
