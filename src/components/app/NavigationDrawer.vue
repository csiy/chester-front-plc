<template>
    <v-navigation-drawer id="core-navigation-drawer"
                         :dark="barColor !== 'rgba(228, 226, 226, 1), rgba(255, 255, 255, 0.7)'"
                         :mini-variant="drawer"
                         :expand-on-hover="drawer"
                         app
                         :mini-variant-width="80"
                         width="260"
                         src="../../assets/images/background.jpg"
                         mobile-break-point="960">

        <template v-slot:img="props">
            <v-img :gradient="`to bottom, ${barColor}`" v-bind="props"/>
        </template>
        <v-list nav>
            <item :item="userInfo"/>
            <v-divider class="mb-2"></v-divider>
            <item-group v-if="item.children" v-for="(item, i) in computedItems" :key="`group-${i}`" :item="item"/>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
    import {
        mapMutations,
        mapState
    } from 'vuex'
    import ItemGroup from "../base/ItemGroup";
    import Item from "../base/Item";

    export default {
        name: "NavigationDrawer",
        components: {Item, ItemGroup},
        created() {
            console.log("created navigation")
        },
        mounted() {
            console.log("mounted navigation")
        },
        computed: {
            ...mapState('user', ['user','roles','menus']),
            ...mapState(['barColor']),
            drawer: {
                get() {
                    return this.$store.state.app.drawer
                },
                set(val) {
                    this.$store.state.app.drawer = val
                }
            },
            userInfo() {
                return {
                    avatar:this.user.photo,
                    url:"/info",
                    group:'a',
                    title: this.user.name,
                }
            },
            computedItems() {
                return this.menus.children.map(this.mapItem);
            },
        },

        methods: {
            mapItem(item) {
                return {
                    icon: item.data.icon,
                    url: item.data.url,
                    group: item.menuId,
                    children: item.children,
                    title: item.data.name,
                }
            },
        },
    }
</script>

<style>
    #core-navigation-drawer.v-navigation-drawer--mini-variant .v-list-item {
        -webkit-box-pack: start !important;
        -ms-flex-pack: start !important;
        justify-content: flex-start !important;
    }
</style>
<style lang="sass">
    @import '~vuetify/src/styles/tools/_rtl.sass'
    #core-navigation-drawer

        .v-list-group__header.v-list-item--active:before
            opacity: .24

        .v-list-item
            &__icon--text,
            &__icon:first-child
                justify-content: center
                text-align: center
                width: 20px

                +ltr()
                    margin-right: 24px
                    margin-left: 12px !important

                +rtl()
                    margin-left: 24px
                    margin-right: 12px !important

        .v-list--dense
            .v-list-item
                &__icon--text,
                &__icon:first-child
                    margin-top: 10px

        .v-list-group--sub-group
            .v-list-item
                +ltr()
                    padding-left: 8px

                +rtl()
                    padding-right: 8px

            .v-list-group__header
                +ltr()
                    padding-right: 0

                +rtl()
                    padding-right: 0

                .v-list-item__icon--text
                    margin-top: 19px
                    order: 0

                .v-list-group__header__prepend-icon
                    order: 2

                    +ltr()
                        margin-right: 8px

                    +rtl()
                        margin-left: 8px
</style>
