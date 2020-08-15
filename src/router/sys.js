export default [
    {
        path: '/sys/users',
        name: '用户管理',
        component: () => import('../views/sys/User'),
    },
    // {
    //     path: '/sys/rules',
    //     name: '路由管理',
    //     component: () => import('../views/sys/Rule'),
    // },
    {
        path: '/sys/roles',
        name: '角色管理',
        component: () => import('../views/sys/Role'),
    },
    {
        path: '/sys/menus',
        name: '菜单管理',
        component: () => import('../views/sys/Menu'),
    },
]