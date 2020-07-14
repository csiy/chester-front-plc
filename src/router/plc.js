export default [
    {
        path: '/plc/machines',
        name: '设备管理',
        component: () => import('../views/plc/Machine'),
    },
    {
        path: '/plc/missions',
        name: '任务管理',
        component: () => import('../views/plc/Mission'),
    },
    {
        path: '/plc/materials',
        name: '物料维护',
        component: () => import('../views/plc/Material'),
    },
    {
        path: '/plc/jobs',
        name: '排程管理',
        component: () => import('../views/plc/Job'),
    }
]