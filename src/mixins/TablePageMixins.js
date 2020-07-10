export default {
    data() {
        return {
            loading: false,
            loadingText: '正在请求数据',
            items: [],
            page: {
                curPage: 1,
                pageSize: 10,
                total: 0,
            },
            totalVisible: 10,
            query: {},
            dialog: {
                plus: null,
                update: null,
                import: null,
            },
            actions:{
                remove: null,
                search: null
            }
        }
    },
    computed: {
        pageCount() {
            return parseInt(this.page.total / this.page.pageSize) + ((this.page.total % this.page.pageSize) > 0 ? 1 : 0)
        }
    },
    methods: {
        importItem(){
            if(this.dialog.import){
                this.$dialog.show(this.dialog.import, {
                    waitForResult: true,//等待弹出框返回值
                    width:1200,
                }).then((v) => {
                    this.search();
                })
            }
        },
        plusItem() {
            if(this.dialog.plus){
                this.$dialog.show(this.dialog.plus, {
                    waitForResult: true,//等待弹出框返回值
                    width:600,
                }).then((v) => {
                    if (v) {
                        this.search();
                    }
                })
            }
        },
        updateItem(item) {
            if(this.dialog.update){
                this.$dialog.show(this.dialog.update, {
                    item: item,
                    waitForResult: true,//等待弹出框返回值
                    width:600,
                }).then((v) => {
                    if (v) {
                        this.search();
                    }
                })
            }
        },
        async deleteItem(id,version) {
            if(this.actions.remove){
                let res = await this.$dialog.confirm({
                    text: `确认要删除吗？删除后将无法恢复！`,
                    title: '删除'
                })
                if (res) {
                    this.actions.remove(id,version).then(() => {
                        this.search();
                    });
                }
            }
        },
        search() {
            if(this.actions.search){
                if (!this.loading) {
                    this.loading = true;
                    this.actions.search(this.query, this.page).then(v => {
                        this.page = v.data.page;
                        this.items = v.data.items;
                    }).finally(() => {
                        this.loading = false;
                    })
                }
            }
        }
    }
}