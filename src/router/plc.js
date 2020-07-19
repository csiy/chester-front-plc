export default [
    {
        path: '/data/machines',
        name: '设备管理',
        component: () => import('../views/plc/Machine'),
    },
    {
        path: '/data/materials',
        name: '物料维护',
        component: () => import('../views/plc/Material'),
    },
    {
        path: '/task/missions',
        name: '任务管理',
        component: () => import('../views/plc/Mission'),
    },
    {
        path: '/task/jobs',
        name: '排程管理',
        component: () => import('../views/plc/Job'),
    },
]