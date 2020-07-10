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
                    {text: '物料号', sortable: false, value: 'materialCode',},
                    {text: '挡位', sortable: false, value: 'gears',},
                    {text: '盘号', sortable: false, value: 'dish',},
                    {text: '定额数量', sortable: false, value: 'quantity',},
                    {text: 'AO工序号', sortable: false, value: 'aoCode',},
                    {text: '生产站位', sortable: false, value: 'position'},
                    {text: '代换新号', sortable: false, value: 'replace'},
                    {text: '原定额代换', sortable: false, value: 'original'},
                    {text: '存储区域', sortable: false, value: 'store'},
                    {text: '存储BIN位', sortable: false, value: 'bin'},
                    {text: '操作', sortable: false, value: 'action',},
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