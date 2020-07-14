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
            <template v-slot:item.gears="{ item }">
                {{gearsDictionary[item.gears]}}
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

    export default {
        name: "Material",
        mounted() {
            this.search();
        },
        mixins:[TablePageMixins,DictionaryMixins],
        data() {
            return {
                headers: [
                    {text: '物料号', sortable: false, value: 'materialCode',width:150},
                    {text: '挡位', sortable: false, value: 'gears',width:150},
                    {text: '盘号', sortable: false, value: 'dish',width:150},
                    {text: '定额数量', sortable: false, value: 'quantity',width:150},
                    {text: 'AO工序号', sortable: false, value: 'aoCode',width:150},
                    {text: '生产站位', sortable: false, value: 'position',width:150},
                    {text: '代换新号', sortable: false, value: 'replace',width:150},
                    {text: '原定额代换', sortable: false, value: 'original',width:150},
                    {text: '存储区域', sortable: false, value: 'store',width:150},
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
    }
</script>

<style scoped>

</style>