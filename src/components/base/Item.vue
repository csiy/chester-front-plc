<template>
    <v-list-item
            :href="href"
            :rel="href && href !== '#' ? 'noopener' : undefined"
            :target="href && href !== '#' ? '_blank' : undefined"
            :to="item.url"
            :active-class="`primary ${!isDark ? 'black' : 'white'}--text`"
            :class="{'ml-3':sub}"
    >
        <v-list-item-avatar
                v-if="item.avatar"
                class="align-self-center"
                contain
        >
            <v-img :src="item.avatar"/>
        </v-list-item-avatar>
        <v-list-item-icon>
            <v-icon v-text="item.icon"/>
        </v-list-item-icon>

        <v-list-item-content v-if="item.title || item.name ||item.subtitle">
            <v-list-item-title v-text="item.title || item.name"/>

            <v-list-item-subtitle v-text="item.subtitle"/>
        </v-list-item-content>
    </v-list-item>
</template>

<script>
    import Themeable from 'vuetify/lib/mixins/themeable'

    export default {
        name: 'Item',

        mixins: [Themeable],

        props: {
            item: {
                type: Object,
                default: () => ({
                    avatar: undefined,
                    href: undefined,
                    icon: undefined,
                    subtitle: undefined,
                    name: undefined,
                    url: undefined,
                }),
            },
            sub: {
                type: Boolean,
                default: false,
            },
        },

        computed: {
            href() {
                return this.item.href || (!this.item.url ? '#' : undefined)
            },
        },
    }
</script>
