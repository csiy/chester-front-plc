<template>
    <v-container fluid>
        <v-data-table
                v-model="selected"
                :loading="loading"
                :headers="headers"
                :items="items"
                hide-default-footer
                :loading-text="loadingText"
                show-select
                item-key="materialId"
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
                        <v-btn @click="search" small>
                            <v-icon left>mdi-magnify</v-icon>
                            搜索
                        </v-btn>
                    </v-col>
                    <v-spacer/>
                    <v-btn @click="bathMission" color="success" small :disabled="selected.length===0">
                        <v-icon left>mdi-shuffle-variant</v-icon>
                        生成任务
                    </v-btn>
                    <v-btn @click="downloadMaterials" small>
                        <v-icon left>mdi-download</v-icon>
                        导出
                    </v-btn>
                    <v-btn @click="importItem" color="orange darken-2" small>
                        <v-icon left>mdi-upload</v-icon>
                        导入
                    </v-btn>
                    <v-btn @click="plusItem" color="orange darken-2" small>
                        <v-icon left>mdi-plus</v-icon>
                        添加
                    </v-btn>
                </v-row>
            </template>
            <template v-slot:item.updatedOn="{ item }">
                {{item.updatedOn|formatTime('YYYY-MM-DD HH:mm')}}
            </template>
            <template v-slot:item.dish="{ item }">
                {{dishDictionary[item.dish]}}
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
                        <v-btn v-on="on" icon color="blue-grey lighten-1" @click="deleteItem(item.materialId,item.version)">
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
    import MaterialApi from "../../api/plc/MaterialApi";
    import DialogPlusMaterial from "../../dialogs/plc/DialogPlusMaterial";
    import DialogUpdateMaterial from "../../dialogs/plc/DialogUpdateMaterial";
    import TablePageMixins from "../../mixins/TablePageMixins";
    import DictionaryMixins from "../../mixins/DictionaryMixins";
    import DialogImportMaterial from "../../dialogs/plc/DialogImportMaterial";
    import export_json_to_excel  from '../../lib/Export2Excel'
    import DialogBatchMission from "../../dialogs/plc/DialogBatchMission";

    export default {
        name: "Material",
        mounted() {
            this.search();
        },
        mixins:[TablePageMixins,DictionaryMixins],
        data() {
            return {
                selected:[],
                headers: [
                    {text: '物料号', sortable: false, value: 'materialCode',width:150},
                    {text: 'AO工序号', sortable: false, value: 'aoCode',width:150},
                    {text: '盘号', sortable: false, value: 'disk',width:150},
                    {text: '定额数量', sortable: false, value: 'quantity',width:150},
                    {text: '生产站位', sortable: false, value: 'position',width:150},
                    {text: '存储BIN位', sortable: false, value: 'bin',width:150},
                    {text: '操作时间', sortable: false, value: 'updatedOn',width:150},
                    {text: '操作人', sortable: false, value: 'updatedName',width:150},
                    {text: '操作', sortable: false, value: 'action',width:150},
                ],
                query: {
                    materialCode: null,
                    aoCode: null,
                },
                dialog: {
                    plus: DialogPlusMaterial,
                    update: DialogUpdateMaterial,
                    import:DialogImportMaterial,
                },
                actions:{
                    remove: MaterialApi.materialDelete,
                    search: MaterialApi.materialPages
                }
            }
        },
        methods: {
            formatJson(filterVal,jsonData){
                return jsonData.map(v => filterVal.map(j=> v[j]))
            },
            bathMission(){
                this.$dialog.show(DialogBatchMission, {
                    waitForResult: true,//等待弹出框返回值
                    width:1200,
                    items: this.selected
                }).then((v) => {
                    this.search();
                })
            },
            downloadMaterials(){
                MaterialApi.materialPages(this.query,{
                    curPage: 1,
                    pageSize: this.page.total
                }).then(v=>{
                    const tHeader = ['物料号','AO工序号','盘号','定额数量','生产站位','存储BIN位']
                    const filterVal = ['materialCode','aoCode','disk','quantity','position','bin']
                    const list = v.data.items.map(v=>{
                        return {
                            'materialCode':v.materialCode,
                            'aoCode':v.aoCode,
                            'disk':v.disk,
                            'quantity':v.quantity,
                            'position':v.position,
                            'bin':v.bin,
                        }
                    })   //table数据
                    const data = this.formatJson(filterVal,list);
                    export_json_to_excel(tHeader,data,'物料');  //导出文件名称
                })
            }
        }
    }
</script>

<style scoped>

</style>
