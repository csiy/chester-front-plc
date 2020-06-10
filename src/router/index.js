import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'
import sys from "./sys";

Vue.use(Router)
Vue.use(Meta)
// Create a new router
const router = new Router({
    routes: [
        {
            path: '/',
            component: () => import('../views/Login'),
            name: '登录',
        },
        {
            path: '/index',
            component: () => import('../views/pfm/admin/Index'),
            name: '首页',
        },
        ...sys,
        {
            path: '/info',
            component: () => import('../views/user/Info'),
            name: '个人资料',
        },
        {
            path: '/404',
            component: () => import('../views/error/404'),
            name: '',
        },
        {path: '*', redirect: '/404'},
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
        if (to.hash) {
            return {selector: to.hash}
        }
        return {x: 0, y: 0}
    }
})

export default router
