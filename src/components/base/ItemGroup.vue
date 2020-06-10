<template>
    <v-list-group
            :value="isO"
            :group="group"
            :prepend-icon="item.icon"
            :sub-group="subGroup"
            :color="barColor !== 'rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.7)' ? 'white' : 'grey darken-1'"
    >
        <template v-slot:activator>
            <v-list-item-icon
                    v-if="text"
                    class="v-list-item__icon--text"
                    v-text="computedText"
            />

            <v-list-item-avatar
                    v-else-if="item.avatar"
                    class="align-self-center"
                    contain
            >
                <v-img :src="item.avatar"/>
            </v-list-item-avatar>

            <v-list-item-content>
                <v-list-item-title v-text="item.title" style="margin-bottom: -2px"/>
                <v-list-item-subtitle v-text="item.subtitle"/>
            </v-list-item-content>
        </template>

        <template v-for="(child, i) in children">
            <item-sub-group
                    v-if="child.children"
                    :key="`sub-group-${i}`"
                    :item="child"
            />
            <item
                    v-else
                    :key="`item-${i}`"
                    :item="child.data"
                    :sub="true"
            />
        </template>
    </v-list-group>
</template>

<script>
    // Utilities
    import kebabCase from 'lodash/kebabCase'
    import {mapState} from 'vuex'
    import ItemSubGroup from "./ItemSubGroup";
    import Item from "./Item";

    export default {
        name: 'ItemGroup',
        components: {Item, ItemSubGroup},
        inheritAttrs: false,

        props: {
            item: {
                type: Object,
                default: () => ({
                    avatar: undefined,
                    group: undefined,
                    title: undefined,
                    children: [],
                }),
            },
            subGroup: {
                type: Boolean,
                default: false,
            },
            text: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                aa:true,
                sub: true
            }
        },

        computed: {
            ...mapState(['barColor']),
            isO(){
                return this.group.indexOf(this.$route.path)>-1;
            },
            children() {
                return this.item.children.map(item => ({
                    ...item,
                    to: !item.url ? undefined : `${this.item.url}/${item.url}`,
                }))
            },
            computedText() {
                if (!this.item || !this.item.title) return ''

                let text = ''

                this.item.title.split(' ').forEach(val => {
                    text += val.substring(0, 1)
                })

                return text
            },
            group() {
                return this.genGroup(this.item.children)
            },
        },

        methods: {
            genGroup(children) {
                return children
                    .filter(item => item.data.url)
                    .map(item => {
                        let group = item.data.url
                        if (item.children) {
                            group = `${group}|${this.genGroup(item.children)}`
                        }
                        return group
                    }).join('|')
            },
        },
    }
</script>

<style>
    .v-list-group__activator p {
        margin-bottom: 0;
    }
</style>
