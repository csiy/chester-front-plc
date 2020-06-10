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
    import UserApi from "../../api/sys/UserApi";
    import MenuApi from "../../api/sys/MenuApi";
    import DialogEditMenu from "../../dialogs/user/DialogEditMenu";

    export default {
        name: "Menu",
        mounted() {
            this.search();
        },
        data() {
            return {
                headers: [
                    {text: '功能名称', sortable: false, value: 'name',},
                    {text: '路径', sortable: false, value: 'url',},
                    {text: '角色', sortable: true, value: 'roles',},
                    {text: '操作', sortable: false, value: 'action',},
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
            ...mapMutations('user',['setMenus']),
            editItem(item) {
                this.$dialog.show(DialogEditMenu, {
                    val:item.roles,
                    menuId:item.menuId,
                    parentIds:item.parentIds,
                    roles:this.roles,
                    waitForResult: true,//等待弹出框返回值
                }).then((v) => {
                    console.log(v)
                    if (v) {
                        MenuApi.userMenus().then(v=>{
                            this.setMenus(v.data);
                        });
                        this.search();
                    }
                })
            },
            search() {
                if (!this.loading) {
                    this.loading = true;
                    MenuApi.getMenus().then(v => {
                        this.items = v.data.filter(v=>v.parentIds.length>0);
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