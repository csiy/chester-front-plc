<template>
    <v-container fluid>
        <v-data-table
                :loading="loading"
                :headers="headers"
                :items="items"
                :loading-text="loadingText"
                :server-items-length="page.total"
                :options.sync="options"
                class="elevation-1 px-4 pb-4">
            <template v-slot:top>
                <v-row align="center" justify="start">
                    <v-col cols="2">
                        <v-text-field clearable v-model.trim="query.address" label="地址" hide-details/>
                    </v-col>
                    <v-col cols="2">
                        <v-btn @click="search" small>
                            <v-icon left>mdi-magnify</v-icon>
                            搜索
                        </v-btn>
                    </v-col>
                </v-row>
            </template>
            <template v-slot:item.disks="{ item }">
                {{item.disks?item.disks.map(v=>v.name).join(','):'暂未设置'}}
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
                    <span>设置</span>
                </v-tooltip>
            </template>
            <template v-slot:no-data>
                未查询到数据
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
                    {text: '机器Id', sortable: false, value: 'machineId'},
                    {text: '位置', sortable: false, value: 'address'},
                    {text: '机器盘', sortable: false, value: 'disks'},
                    {text: '链接状态', sortable: false, value: 'linkState'},
                    {text: '操作时间', sortable: false, value: 'updatedOn'},
                    {text: '操作人', sortable: false, value: 'updatedName'},
                    {text: '操作', sortable: false, value: 'action'},
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
