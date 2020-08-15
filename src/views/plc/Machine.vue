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
                        <v-text-field clearable v-model.trim="query.address" label="地址" hide-details/>
                    </v-col>
                    <v-col cols="2">
                        <v-btn @click="search">
                            <v-icon left>mdi-magnify</v-icon>
                            搜索
                        </v-btn>
                    </v-col>
                </v-row>
            </template>
            <template v-slot:item.disk="{ item }">
                <v-edit-dialog large :return-value.sync="item.disk" @save="saveRuntimeDishNumber(item)">
                    {{item.disk?item.disk:'暂未设置'}}
                    <template v-slot:input>
                        <v-select counter v-model="item.disk" :items="item.diskList" label="请选择盘号" required/>
                    </template>
                </v-edit-dialog>
            </template>
            <template v-slot:item.linkState="{ item }">
                {{item.linkState?'已链接':'未链接'}}
            </template>
            <template v-slot:item.updatedOn="{ item }">
                {{item.updatedOn|formatTime('YYYY-MM-DD HH:mm')}}
            </template>
            <template v-slot:item.action="{ item }">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" icon color="blue-grey lighten-1" class="mr-2" @click="updateItem(item)">
                            <v-icon>mdi-cog-outline</v-icon>
                        </v-btn>
                    </template>
                    <span>修改</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" icon color="blue-grey lighten-1" @click="deleteItem(item.machineId,item.version)">
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
    import MachineApi from "../../api/plc/MachineApi";
    import TablePageMixins from "../../mixins/TablePageMixins";
    import DictionaryMixins from "../../mixins/DictionaryMixins";
    import DialogUpdateMachine from "../../dialogs/plc/DialogUpdateMachine";

    export default {
        name: "Machine",
        mounted() {
            this.search();
        },
        mixins:[TablePageMixins,DictionaryMixins],
        data() {
            return {
                headers: [
                    {text: '机器Id', sortable: false, value: 'machineId',width:150},
                    {text: '位置', sortable: false, value: 'address',width:300},
                    {text: '当前盘号', sortable: false, value: 'disk',width:120},
                    {text: '机器盘', sortable: false, value: 'diskList',width:300},
                    {text: '链接状态', sortable: false, value: 'linkState',width:100},
                    {text: '操作时间', sortable: false, value: 'updatedOn',width:150},
                    {text: '操作人', sortable: false, value: 'updatedName',width:100},
                    {text: '操作', sortable: false, value: 'action',width:150},
                ],
                query: {
                    address: null
                },
                dialog: {
                    update: DialogUpdateMachine,
                },
                actions:{
                    remove: MachineApi.machineDelete,
                    search: MachineApi.machinePages
                }
            }
        },
        methods:{
            saveRuntimeDishNumber(item){
                MachineApi.machineUpdateDish(item).then(v=>{
                    this.search()
                });
            }
        }
    }
</script>

<style scoped>

</style>