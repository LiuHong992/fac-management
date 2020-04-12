import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../pages/Home.vue'

Vue.use(VueRouter)

const routes = [
    // 首页
    {
        path: '/',
        component: Home,
        children: [{
            path: '',
            name: 'index',
            meta: {
                title: '首页'
            },
            component: () =>
                import ('../pages/Index/Index')
        }],
    },
    // 用户管理
    // 用户列表
    {
        path: '/users/users',
        component: Home,
        children: [{
            path: '',
            name: 'users',
            meta: {
                title: '用户列表'
            },
            component: () =>
                import ('../pages/Users/User')
        }]
    },
    // 权限管理
    // 角色列表
    {
        path: '/rights/roles',
        component: Home,
        children: [{
            path: '',
            name: 'roles',
            meta: {
                title: '角色列表'
            },
            component: () =>
                import ('../pages/Rights/Roles')
        }]
    },
    // 权限列表
    {
        path: '/rights/rights',
        component: Home,
        children: [{
            path: '',
            name: 'rights',
            meta: {
                title: '权限列表'
            },
            component: () =>
                import ('../pages/Rights/Rights')
        }]
    },
    // 商品管理
    // 商品列表
    {
        path: '/goods/goods',
        component: Home,
        children: [{
            path: '',
            name: 'goods',
            meta: {
                title: '商品列表'
            },
            component: () =>
                import ('../pages/Goods/Goods')
        }]
    },
    // 分类列表
    {
        path: '/goods/params',
        component: Home,
        children: [{
            path: '',
            name: 'params',
            meta: {
                title: '分类列表'
            },
            component: () =>
                import ('../pages/Goods/Params')
        }]
    },
    // 商品分类
    {
        path: '/goods/categories',
        component: Home,
        children: [{
            path: '',
            name: 'categories',
            meta: {
                title: '商品分类'
            },
            component: () =>
                import ('../pages/Goods/Categories')
        }]
    },
    // 订单管理
    // 订单列表
    {
        path: '/orders/orders',
        component: Home,
        children: [{
            path: '',
            name: 'orders',
            meta: {
                title: '订单列表'
            },
            component: () =>
                import ('../pages/Order/Order')
        }]
    },
    // 数据统计
    // 数据报表
    {
        path: '/reports/reports',
        component: Home,
        children: [{
            path: '',
            name: 'reports',
            meta: {
                title: '数据报表'
            },
            component: () =>
                import ('../pages/Reports/Reports')
        }]
    },
    // 登录
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录'
        },
        component: () =>
            import ('../pages/Login')
    },
    // 404页面
    {
        path: '*',
        name: 'error',
        meta: {
            title: '404 Not Found'
        },
        component: () =>
            import ('../pages/Error')
    },
]

const isPro = process.env.NODE_ENV === 'production'

const router = new VueRouter({
    mode: isPro ? 'hash' : 'history',
    base: process.env.BASE_URL,
    routes
})

// 路由守卫

router.beforeEach((to, from, next) => {
    document.title = to.meta.title
    let isLogin = localStorage.getItem('userData')
    if (to.path === '/login') {
        next()
    } else {
        isLogin ? next() : next('/login')
    }
})


router.beforeEach((to, from, next) => {

    next()
})

export default router