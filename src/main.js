import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import message from './utils/message';
import './plugins/base'
import './plugins/chartist'
import './plugins/vee-validate'
import vuetify from './plugins/vuetify';
import moment from 'moment';
import VuetifyDialog from 'vuetify-dialog'
import 'vuetify-dialog/dist/vuetify-dialog.css'

Vue.use(VuetifyDialog, {
    context: {
        vuetify
    },
    confirm: {
        actions: {
            false: {
                text: '取消',
                color: '#8f8f8f'
            },
            true: {
                text: '确定',
                color: 'primary'
            }
        },
        icon: false, // to disable icon just put false
        width: 500
    },
})

router.beforeEach((to, from, next) => {
    store.commit("meta/setMeta", {
        title:to.name,
        keywords:'',
        description:''
    });
    if (window.localStorage.access_token) {
        if (to.matched.some(record => record.meta.requiresAuth)) {
            // this route requires auth, check if logged in
            // if not, redirect to login page.
            if (!auth.loggedIn()) {
                next({
                    path: '/login',
                    query: {redirect: to.fullPath}
                })
            } else {
                next()
            }
        } else {
            next() // 确保一定要调用 next()
        }
    } else {
        if (to.path != '/') {
            next({
                path: '/',
            })
        } else {
            next()
        }
    }
})

Vue.config.productionTip = false
Vue.use(message);

Vue.filter('formatTime', function (date, fmt) {
    if(date){
        return moment(date).format(fmt);
    }
})


new Vue({
    router,
    store,
    vuetify,
    metaInfo() {
        return {
            title: store.state.meta.title,
            meta: [
                {
                    name: "keywords",
                    content: store.state.meta.keywords
                },
                {
                    name: "description",
                    content: store.state.meta.description
                }
            ]
        };
    },
    render: h => h(App)
}).$mount('#app')
