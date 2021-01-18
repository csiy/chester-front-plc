export default {
    data() {
        return {
            loading: false,
            loadingText: '正在请求数据',
            options:{},
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
    watch: {
        options:{
            handler () {
                this.page.curPage = this.options.page
                this.page.pageSize = this.options.itemsPerPage === -1?this.page.total:this.options.itemsPerPage
                this.search()
            },
            deep: true,
        }
    },
    methods: {
        importItem(){
            if(this.dialog.import){
                this.$dialog.show(this.dialog.import, {
                    waitForResult: true,//等待弹出框返回值
                    width:800,
                }).then((v) => {
                    this.search();
                })
            }
        },
        plusItem() {
            if(this.dialog.plus){
                this.$dialog.show(this.dialog.plus, {
                    waitForResult: true,//等待弹出框返回值
                    width:800,
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
                    width:800,
                }).then((v) => {
                    if (v) {
                        this.search();
                    }
                })
            }
        },
        async deleteItem(id) {
            if(this.actions.remove){
                let res = await this.$dialog.confirm({
                    text: `确认要删除吗？删除后将无法恢复！`,
                    title: '删除'
                })
                if (res) {
                    this.actions.remove(id).then(() => {
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