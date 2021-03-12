<template>
    <v-card :loading="loading">
        <v-card-title>
            <span class="headline">导入物料</span>
        </v-card-title>
        <v-card-text>
            <FileDrag v-if="data.length===0" @data="dataChange" link="/static/download/物料导入模板.xlsx"/>
            <v-data-table v-else
                    :headers="headers"
                    :items="data"
                    class="elevation-1 px-4 pb-4">
                <template v-slot:top>
                    <v-row align="center" justify="start">
                        <v-btn class="mt-2" @click="data = []"><v-icon left>mdi-cancel</v-icon>取消</v-btn>
                        <v-spacer/>
                        <v-btn color="orange darken-2" class="mt-2" @click="submit"><v-icon left>mdi-upload</v-icon>导入</v-btn>
                    </v-row>
                </template>
                <template v-slot:item.materialCode="{item}">
                    <v-edit-dialog large :return-value.sync="item.materialCode">
                        {{ item.materialCode }}
                        <template v-slot:input>
                            <v-text-field
                                    v-model.trim="item.materialCode"
                                    label="请输入物料号"
                                    :rules="[rules.materialCode]"
                                    counter
                            ></v-text-field>
                        </template>
                    </v-edit-dialog>
                </template>
                <template v-slot:item.aoCode="{item}">
                    <v-edit-dialog large :return-value.sync="item.aoCode">
                        {{ item.aoCode }}
                        <template v-slot:input>
                            <v-text-field
                                    v-model.trim="item.aoCode"
                                    label="请输入AO工序号"
                                    :rules="[rules.aoCode]"
                                    counter
                            ></v-text-field>
                        </template>
                    </v-edit-dialog>
                </template>
                <template v-slot:item.disk="{item}">
                    <v-edit-dialog large :return-value.sync="item.disk">
                        {{ item.disk }}
                        <template v-slot:input>
                            <v-text-field
                                    v-model.trim="item.disk"
                                    :rules="[rules.disk]"
                                    label="请输入盘号"
                                    counter
                            ></v-text-field>
                        </template>
                    </v-edit-dialog>
                </template>
                <template v-slot:item.quantity="{item}">
                    <v-edit-dialog large :return-value.sync="item.quantity">
                        {{ item.quantity }}
                        <template v-slot:input>
                            <v-text-field
                                    v-model.trim="item.quantity"
                                    label="请输入定额数量"
                                    :rules="[rules.quantity]"
                                    counter
                            ></v-text-field>
                        </template>
                    </v-edit-dialog>
                </template>
                <template v-slot:item.position="{item}">
                    <v-edit-dialog large :return-value.sync="item.position">
                        {{ item.position }}
                        <template v-slot:input>
                            <v-text-field
                                    v-model.trim="item.position"
                                    label="请输入生产站位"
                                    :rules="[rules.position]"
                                    counter
                            ></v-text-field>
                        </template>
                    </v-edit-dialog>
                </template>
                <template v-slot:item.actions="{item}">
                    <v-btn icon color="blue-grey lighten-1" @click="deleteItem(item)">
                        <v-icon>mdi-delete-forever-outline</v-icon>
                    </v-btn>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
</template>

<script>
    import FileDrag from "../../components/base/FileDrag";
    import DictionaryMixins from "../../mixins/DictionaryMixins";
    import MaterialApi from "../../api/plc/MaterialApi";
    export default {
        name: "DialogImportMaterial",
        components: {FileDrag},
        mixins:[DictionaryMixins],
        data(){
          return {
              loading: false,
              data: [],
              headers: [
                  {text: '物料号', sortable: false, value: 'materialCode',width:120},
                  {text: 'AO工序号', sortable: false, value: 'aoCode',width:120},
                  {text: '盘号', sortable: false, value: 'disk',width:120},
                  {text: '定额数量', sortable: false, value: 'quantity',width:120},
                  {text: '生产站位', sortable: false, value: 'position',width:120},
                  {text: '状态', sortable: false, value: 'status',width:120},
                  {text: '操作', sortable: false, value: 'actions',width:120}
              ],
              rules: {
                  materialCode: (v) => v!=null||'请输入物料号',
                  disk: (v) => v!=null||'请选择盘号',
                  quantity: (v) => /^[1-9]\d*$/.test(v)&&v<100000000||'请输入定额数量',
                  aoCode: (v) => v!=null||'请输入AO工序号',
                  position: (v) => v!=null||'请输入生产站位',
              },
          }
        },
        methods: {
            deleteItem(item){
                this.data.splice(this.data.indexOf(item),1)
            },
            dataChange(data){
                if(data){
                    this.data = data.map(v=>{
                        return {
                            materialCode:v['*物料号'],
                            disk:v['*盘号'],
                            quantity:v['*定额数量'],
                            aoCode:v['*AO工序号'],
                            position:v['*生产站位'],
                            status: ''
                        }
                    })
                }
            },
            async submit(){
                if(!this.loading){
                    this.loading = true;
                    for(let i=0;i<this.data.length;i++){
                        let material = this.data[i];
                        if(!material.materialCode){
                            material.status = "请输入物料号"
                        }else if(!material.aoCode){
                            material.status = "请输入AO工序号"
                        }else if(!material.disk){
                            material.status = "请选择盘号"
                        }else if(!material.quantity){
                            material.status = "请输入定额数量"
                        }else if(!material.position){
                            material.status = "请输入生产站位"
                        }else{
                            await MaterialApi.materialPlus(material).then(()=>{
                                material.status = "导入成功"
                            }).catch((v)=>{
                                material.status = v
                            })
                        }
                        this.loading = false;
                    }
                }
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>