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
                    <v-spacer/>
                    <v-btn @click="plusItem" color="orange darken-2">
                        <v-icon left>mdi-plus</v-icon>
                        添加
                    </v-btn>
                </v-row>
            </template>
            <template v-slot:item.machineDishList="{ item }">
                {{item.machineDishList.map(v=>{return dishDictionary[v.dish]+'盘'+gearsDictionary[v.gears]+'挡'}).join('，')}}
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
    import DialogPlusMachine from "../../dialogs/plc/DialogPlusMachine";
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
                    {text: '机器盘', sortable: false, value: 'machineDishList',width:300},
                    {text: '机器单片机参数', sortable: false, value: 'params',},
                    {text: '操作', sortable: false, value: 'action',},
                ],
                query: {
                    address: null
                },
                dialog: {
                    plus: DialogPlusMachine,
                    update: DialogUpdateMachine,
                },
                actions:{
                    remove: MachineApi.machineDelete,
                    search: MachineApi.machinePages
                }
            }
        },
    }
</script>

<style scoped>

</style>