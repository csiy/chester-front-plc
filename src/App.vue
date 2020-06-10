<template>
    <v-app>
        <AppBar v-if="login"/>
        <NavigationDrawer v-if="login"/>
        <v-content v-if="!isLoading">
            <v-fade-transition mode="out-in">
                <router-view/>
            </v-fade-transition>
        </v-content>
        <loading :active.sync="isLoading" :is-full-page="fullPage"/>
    </v-app>
</template>

<script>

    import {
        mapMutations,
        mapState
    } from 'vuex'
    import Loading from 'vue-loading-overlay';
    import 'vue-loading-overlay/dist/vue-loading.css';
    import UserApi from './api/sys/UserApi'
    import AuthApi from './api/sys/AuthApi'
    import AppBar from "./components/app/AppBar";
    import NavigationDrawer from "./components/app/NavigationDrawer";

    export default {
        name: 'App',
        components: {
            NavigationDrawer,
            AppBar,
            Loading
        },
        created() {
            // 网络断开
            window.addEventListener('offline', () => {
                this.$message.error('网络已经断开，请检查网络！');
            })
            // 网络重连
            window.addEventListener('online', () => {
                this.$message.success('网络已连接');
            })
            this.initAuth();
        },
        data: () => ({
            isLoading: true,
            fullPage: true,
        }),
        methods: {
            ...mapMutations('user', ['initUser']),
            ...mapMutations('app', ['setLogin']),
            initAuth() {
                AuthApi.loginByAuth().then(v => {
                    UserApi.getUser().then(user => {
                        this.isLoading = false;
                        this.initUser(user.data);
                        this.setLogin(true);
                        if(this.$route.path==='/'){
                            this.$router.push(`/index`).catch(err => err);
                        }
                    }).catch(v => {
                        this.isLoading = false;
                        this.$router.push({path: '/'}).catch(err => err);
                    });
                }).catch(v => {
                    this.isLoading = false;
                    this.$router.push({path: '/'}).catch(err => err);
                });
            },
        },
        computed: {
            ...mapState('app', ['login']),
            ...mapState('user', ['roleId']),
        },
    }
</script>
