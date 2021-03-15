<template>
  <v-container fluid>
    <v-data-table
        v-model="selected"
        :loading="loading"
        :headers="headers"
        :items="items"
        :loading-text="loadingText"
        :server-items-length="page.total"
        :options.sync="options"
        show-select
        item-key="missionId"
        class="elevation-1 px-4 pb-4">
      <template v-slot:top>
        <v-row align="center" justify="start">
          <v-col cols="1.5">
            <v-text-field clearable v-model.trim="query.materialCode" label="请输入物料号" hide-details/>
          </v-col>
          <v-col cols="1.5">
            <v-text-field clearable v-model.trim="query.aoCode" label="请输入AO工序号" hide-details/>
          </v-col>
          <v-col cols="1.5">
            <v-select clearable v-model.trim="query.status" :items="missionStatus" item-text="name"
                      item-value="value" label="请选择状态" hide-details/>
          </v-col>
          <v-col cols="1.5">
            <v-menu
                ref="dateMenu"
                v-model="dateMenu"
                :close-on-content-click="false"
                :return-value.sync="query.date"
                transition="scale-transition"
                offset-y
                min-width="290px">
              <template v-slot:activator="{ on }">
                <v-text-field
                    hide-details
                    clearable
                    v-model.trim="query.date"
                    label="操作日期"
                    prepend-icon="mdi-calendar-account-outline"
                    readonly
                    v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="query.date" scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="dateMenu = false">取消</v-btn>
                <v-btn text color="primary" @click="$refs.dateMenu.save(query.date)">确定</v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-spacer/>
          <v-btn @click="search" small>
            <v-icon left>mdi-magnify</v-icon>
            搜索
          </v-btn>
        </v-row>
        <v-row>
          <v-spacer/>
          <v-btn @click="bathDelete" color="red" small :disabled="selected.length===0">
            <v-icon left>mdi-delete-forever-outline</v-icon>
            批量删除
          </v-btn>
          <v-btn @click="printItems" color="success" small :disabled="selected.length===0">
            <v-icon left>mdi-cloud-print-outline</v-icon>
            批量打印
          </v-btn>
          <v-btn @click="printPDFItems" color="success" small :disabled="selected.length===0">
            <v-icon left>mdi-file-pdf-box-outline</v-icon>
            PDF
          </v-btn>
          <v-btn @click="downloadMission" small>
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
        {{ item.updatedOn|formatTime('MM-DD') }}
      </template>
      <template v-slot:item.status="{ item }">
        {{ statusType[item.status] }}
      </template>
      <template v-slot:item.action="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" icon color="blue-grey lighten-1" @click="printItem(item)">
              <v-icon>mdi-cloud-print-outline</v-icon>
            </v-btn>
          </template>
          <span>打印</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" icon color="blue-grey lighten-1" @click="printPDFItem(item)">
              <v-icon>mdi-file-pdf-box-outline</v-icon>
            </v-btn>
          </template>
          <span>PDF</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-if="item.transform!==2" v-slot:activator="{ on }">
            <v-btn v-on="on" icon color="blue-grey lighten-1" @click="updateItem(item)">
              <v-icon>mdi-cog-outline</v-icon>
            </v-btn>
          </template>
          <span>修改</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" icon color="blue-grey lighten-1"
                   @click="deleteItem(item.missionId)">
              <v-icon>mdi-delete-forever-outline</v-icon>
            </v-btn>
          </template>
          <span>删除</span>
        </v-tooltip>
      </template>
      <template v-slot:no-data>
        未查询到数据
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
import export_json_to_excel from "../../lib/Export2Excel";
import Labels from "../../components/label/Labels";
import Label from "../../components/label/Label";
import MaterialApi from "../../api/plc/MaterialApi";

export default {
  name: "Mission",
  mounted() {
    this.search();
  },
  mixins: [TablePageMixins, DictionaryMixins],
  data() {
    return {
      dateMenu: false,
      selected: [],
      missionStatus: [
        {
          value: 0,
          name: '未执行'
        },
        {
          value: 1,
          name: '进行中'
        },
        {
          value: 2,
          name: '任务完成'
        },
        {
          value: 3,
          name: '任务异常终止'
        }
      ],
      headers: [
        {text: '任务ID', sortable: false, value: 'missionId'},
        {text: '分配ID', sortable: false, value: 'waveNo'},
        {text: '物料号', sortable: false, value: 'materialCode'},
        {text: 'AO工序号', sortable: false, value: 'aoCode'},
        {text: '检字号', sortable: false, value: 'verify'},
        {text: '包装数量', sortable: false, value: 'count', width: 60},
        {text: '定额数量', sortable: false, value: 'quantity', width: 60},
        {text: '状态', sortable: false, value: 'status', width: 80},
        {text: '操作时间', sortable: false, value: 'updatedOn', width: 80},
        {text: '操作人', sortable: false, value: 'updatedName', width: 80},
        {text: '操作', sortable: false, value: 'action', width: 170},
      ],
      query: {
        materialCode: null,
        aoCode: null,
        status: null,
        date: null
      },
      statusType: {
        0: '未执行',
        1: '进行中',
        2: '任务完成',
        3: '任务异常终止'
      },
      dialog: {
        plus: DialogPlusMission,
        update: DialogUpdateMission,
        import: DialogImportMission
      },
      actions: {
        remove: MissionApi.missionDelete,
        search: MissionApi.missionPages
      }
    }
  },
  methods: {
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    downloadMission() {
      MissionApi.missionPages(this.query, {
        curPage: 1,
        pageSize: this.page.total
      }).then(v => {
        const tHeader = ['分配ID', '物料号', 'AO工序号', '检字号', '包装数量', '定额数量', '状态']
        const filterVal = ['waveNo', 'materialCode', 'aoCode', 'verify', 'count', 'quantity', 'status']
        const list = v.data.items.map(v => {
          return {
            'waveNo': v.waveNo,
            'materialCode': v.materialCode,
            'aoCode': v.aoCode,
            'verify': v.verify,
            'count': v.count,
            'quantity': v.quantity,
            'status': this.status[v.status],
          }
        })   //table数据
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, '任务');  //导出文件名称
      })
    },
    async bathDelete() {
      if (this.actions.remove) {
        let res = await this.$dialog.confirm({
          text: `确认要删除吗？删除后将无法恢复！`,
          title: '删除'
        })
        if (res) {
          let items = this.selected;
          this.selected = [];
          items.forEach(item => {
            this.actions.remove(item.missionId, item.version).then(() => {
              this.search();
            });
          })

        }
      }
    },
    printItems() {
      if (this.selected.length === 0) {
        this.$message.warning('请先选择')
      } else {
        let ids = this.selected.map(v => v.waveNo)
        MissionApi.print({ids}).then(()=>{
          this.$message.warning('以提交打印')
        })
      }
    },
    printItem(item) {
      MissionApi.print({ids:[item.waveNo]}).then(()=>{
        this.$message.warning('以提交打印')
      })
    },
    printPDFItems() {
      if (this.selected.length === 0) {
        this.$message.warning('请先选择')
      } else {
        let labels = this.selected.map(v => {
          return {
            missionId: v.missionId,
            aoCode: v.aoCode,
            count: v.count,
            materialCode: v.materialCode,
            quantity: v.quantity,
            position: v.position,
            t: new Date().getTime()
          }
        })
        this.$dialog.show(Labels, {
          labelSize: {
            w: 10,
            h: 8
          },
          labels: labels,
          width: 600,
        })
      }
    },
    printPDFItem(item) {
      MaterialApi.getMaterial(item.materialCode, item.aoCode).then(v => {
        this.$dialog.show(Label, {
          labelSize: {
            w: 10,
            h: 8
          },
          missionId: item.missionId,
          form: {...v.data},
          width: 600,
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
