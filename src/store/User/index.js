// 默认导出一个对象既一个模块
import api from '../../http/api'
import { Message } from 'element-ui'
import router from '../../router'

export default {
    // 需要命名空间
    namespaced: true,
    state: {
        // 接收请求出来的用户列表
        usersArr: [],
        // 当前选中的角色(商品、用户)
        editObj: {},
    },
    mutations: {
        // 用户列表的处理
        setUsersArr(state, data) {
            state.usersArr = data
        },
        // 当前用户的处理
        setEditObj(state, data) {
            state.editObj = data
        },
    },
    actions: {
        // 登录
        async logins({ commit }, params) {
            let res = await api.login(params)
                // console.log(res);
            if (res.meta.status === 200) {
                localStorage.setItem('userData', JSON.stringify(res.data))
                localStorage.setItem('adminToken', res.data.token)
                Message.success(res.meta.msg)
                router.push('/')
            } else {
                Message.error(res.meta.msg)
            }
        },
        // 获取用户列表
        async getUsersList({ commit }, { pagenum, pagesize, query }) {
            let res = await api.getUserList({ pagenum, pagesize, query })
            if (res.meta.status === 200) {
                commit('setUsersArr', res.data.users)
            }
        },
        // 改变用户状态
        async changeStates({ commit, dispatch }, { uId, type }) {
            let res = await api.changeStatus({ uId, type })
            if (res.meta.status === 200) {
                Message.success(res.meta.msg)
            }
        },
        // 修改用户邮箱和手机号
        async updateInfo({ commit }, { id, email, mobile }) {
            let res = await api.editUserInfo({ id, email, mobile })
            if (res.meta.status === 200) {
                Message.success(res.meta.msg)
            }
        },
        // 根据id查询用户
        async getById({ commit }, id) {
            try {
                let res = await api.getUserById(id)
                if (res.meta.status === 200) {
                    commit('setEditObj', res.data)
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 删除用户
        async delUser({ commit }, id) {
            let res = await api.deleteOneUser(id)
            console.log(res);
        },
        // 添加用户
        async addUsers({ commit }, params) {
            let res = await api.addUser(params)
            if (res.meta.status === 201) {
                Message.success(res.meta.msg)
            }
        },
        // 给用户分配角色
        async assignRole({ commit }, { id, rid }) {
            let res = await api.assignRoles({ id, rid })
            if (res.meta.status === 200) {
                Message.success(res.meta.msg)
            }
        }
    },
    getters: {},
}