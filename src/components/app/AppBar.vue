<template>
    <v-app-bar app color="transparent" flat>
        <v-btn
                class="mr-3"
                elevation="1"
                fab
                small
                @click="toggleDrawer"
        >
            <v-icon v-if="drawer">
                mdi-view-quilt
            </v-icon>

            <v-icon v-else>
                mdi-dots-vertical
            </v-icon>
        </v-btn>
        <v-toolbar-title>{{title}}</v-toolbar-title>
        <v-spacer/>
        <v-menu left bottom offset-y offset-x>
            <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
            </template>
            <v-list>
                <v-list-item link to="/info">
                    <v-list-item-icon><v-icon>mdi-information-variant</v-icon></v-list-item-icon>
                    <v-list-item-title>个人资料</v-list-item-title>
                </v-list-item>
                <v-list-item link @click="logout">
                    <v-list-item-icon><v-icon>mdi-logout</v-icon></v-list-item-icon>
                    <v-list-item-title>退出</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </v-app-bar>
</template>

<script>
    import {
        mapMutations,
        mapState
    } from 'vuex'

    export default {
        name: "AppBar",
        methods: {
            ...mapMutations('app', ['toggleDrawer','setLogin']),
            ...mapMutations('user', ['clearUser']),
            name(r) {
                let n = '';
                if (r.parent) {
                    n = this.name(r.parent) + '/';
                }
                n += r.name;
                return n;
            },
            logout(){
                this.clearUser();
                this.setLogin(false);
                localStorage.clear();
                this.$router.push('/').catch(err => err);
            }
        },
        computed: {
            ...mapState('app', ['drawer']),
            ...mapState('user', ['appName', 'className']),
            title() {
                let r = this.$route.matched.filter(v => {
                    return v.path === this.$route.path;
                })[0];
                if(r){
                    return this.name(r);
                }
                return "";
            }
        },
    }
</script>

<style scoped>
</style>
