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
                        <v-text-field clearable v-model.trim="query.materialCode" label="请输入物料号" hide-details/>
                    </v-col>
                    <v-col cols="2">
                        <v-text-field clearable v-model.trim="query.aoCode" label="请输入AO工序号" hide-details/>
                    </v-col>
                    <v-col cols="2">
                        <v-btn @click="search">
                            <v-icon left>mdi-magnify</v-icon>
                            搜索
                        </v-btn>
                    </v-col>
                    <v-spacer/>
                    <v-btn @click="importItem" color="orange darken-2">
                        <v-icon left>mdi-upload</v-icon>
                        导入
                    </v-btn>
                    <v-btn @click="plusItem" color="orange darken-2">
                        <v-icon left>mdi-plus</v-icon>
                        添加
                    </v-btn>
                </v-row>
            </template>
            <template v-slot:item.action="{ item }">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" icon color="blue-grey lighten-1" class="mr-2" @click="printItem(item)">
                            <v-icon>mdi-cloud-print-outline</v-icon>
                        </v-btn>
                    </template>
                    <span>打印</span>
                </v-tooltip>
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
                        <v-btn v-on="on" icon color="blue-grey lighten-1" @click="deleteItem(item.missionId,item.version)">
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
    import MissionApi from "../../api/plc/MissionApi";
    import TablePageMixins from "../../mixins/TablePageMixins";
    import DictionaryMixins from "../../mixins/DictionaryMixins";
    import DialogPlusMission from "../../dialogs/plc/DialogPlusMission";
    import DialogUpdateMission from "../../dialogs/plc/DialogUpdateMission";
    import DialogImportMission from "../../dialogs/plc/DialogImportMission";
    import Label from "../../components/label/Label";
    import MaterialApi from "../../api/plc/MaterialApi";

    export default {
        name: "Mission",
        mounted() {
            this.search();
        },
        mixins:[TablePageMixins,DictionaryMixins],
        data() {
            return {
                headers: [
                    {text: '单号', sortable: false, value: 'missionId'},
                    {text: '物料号', sortable: false, value: 'materialCode',},
                    {text: 'AO工序号', sortable: false, value: 'aoCode',},
                    {text: '包装数量', sortable: false, value: 'count',},
                    {text: '任务状态', sortable: false, value: 'status',},
                    {text: '任务优先级', sortable: false, value: 'order',},
                    {text: '操作', sortable: false, value: 'action',},
                ],
                query: {
                    materialCode: null,
                    aoCode: null,
                },
                dialog: {
                    plus: DialogPlusMission,
                    update: DialogUpdateMission,
                    import: DialogImportMission
                },
                actions:{
                    remove: MissionApi.missionDelete,
                    search: MissionApi.missionPages
                }
            }
        },
        methods: {
            printItem(item){
                MaterialApi.getMaterial(item.materialCode,item.aoCode).then(v=>{
                    this.$dialog.show(Label, {
                        pageSize: {
                            w:6,
                            h:4
                        },
                        labelSize:{
                            w:6,
                            h:4
                        },
                        missionId: item.missionId,
                        form: {...v.data},
                        width:600,
                    })
                })
            },
        }
    }
</script>

<style scoped>

</style>