<template>
    <v-card :loading="loading">
        <v-card-title>
            <span class="headline">设置菜单&路由权限</span>
        </v-card-title>
        <v-card-text class="px-0">
            <v-container class="overflow-y-auto" style="height: 550px">
                <v-row>
                    <v-col cols="4" class="overflow-y-auto" style="height: 500px">
                        <v-treeview
                                v-model="selection"
                                :items="menus.children"
                                selection-type="leaf"
                                item-text="data.name"
                                item-key="data.menuId"
                                selectable
                                return-object
                                open-all
                        ></v-treeview>
                    </v-col>
                    <v-divider vertical/>
                    <v-col cols="7" class="overflow-y-auto" style="height: 500px">
                        <div v-for="node in selection" :key="node.id">
                            <v-subheader>{{ node.data.name }}</v-subheader>
                            <v-row class="mx-0 px-2">
                                <v-checkbox  v-for="item in rules.filter(v=>v.path.indexOf(node.data.path)>-1)" :value="item.ruleId" v-model="ruleList" class="mx-2" :key="item.ruleId.counter" :label="item.remark"/>
                            </v-row>
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="success darken-1" @click="save">修改</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import NavigationDrawer from "../../components/app/NavigationDrawer";
    import MenuApi from "../../api/sys/MenuApi";
    import RuleApi from "../../api/sys/RuleApi";
    export default {
        name: "DialogEditRole",
        components: {NavigationDrawer},
        props: ['role','menus','rules'],
        created() {
            this.ruleList = this.rules.filter(v=>v.roles.indexOf(this.role)>-1).map(v=>v.ruleId);
            let selection = [];
            this.menus.children.forEach(v=>{
                selection = selection.concat(v.children.filter(v=>v.data.roles.indexOf(this.role)>-1));
            })
            this.selection = selection;
        },
        data() {
            return {
                loading: false,
                selection:[],
                ruleList:[],
            }
        },
        methods: {
            async save() {
                if(!this.loading){
                    this.loading = true;
                    let pushMenuIds = [];
                    this.selection.forEach(v=>{
                        pushMenuIds.push(v.data.menuId);
                        pushMenuIds = pushMenuIds.concat(v.data.parentIds);
                    });
                    let pullMenuIds = [];
                    this.menus.children.forEach(v=>{
                        pullMenuIds = pullMenuIds.concat(v.children.filter(v=>pushMenuIds.indexOf(v.data.menuId)===-1).map(v=>v.data.menuId));
                    })
                    let pullRules = this.rules.filter(v=>this.ruleList.indexOf(v.ruleId)===-1).map(v=>v.ruleId);
                    console.log(pullRules);
                    await MenuApi.pushMenu({role:this.role,menuIds:pushMenuIds}).catch(v=>this.loading = false);
                    await MenuApi.pullMenu({role:this.role,menuIds:pullMenuIds}).catch(v=>this.loading = false);
                    await RuleApi.pushRule({role:this.role,ruleIds:this.ruleList}).catch(v=>this.loading = false);
                    await RuleApi.pullRule({role:this.role,ruleIds:pullRules}).catch(v=>this.loading = false);
                    this.loading = false;
                    this.$emit('submit',true)
                }
            },
        }
    }
</script>

<style scoped>

</style>