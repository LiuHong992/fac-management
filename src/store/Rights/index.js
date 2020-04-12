// 默认导出一个对象既一个模块
import api from '../../http/api'
import { Message } from 'element-ui'
import router from '../../router'

export default {
    // 需要命名空间
    namespaced: true,
    state: {
        // 接收所有的角色
        rolesArr: [],
        // 接收所有的权限(list)
        listRights: [],
        // 接收所有的权限(tree)
        treeRights: [],
        // 当前选中用户的权限列表
        editRightsArr: []
    },
    mutations: {
        // 角色信息的处理
        setRolesArr(state, data) {
            state.rolesArr = data
                // console.log(state.rolesArr);
        },
        // 权限信息的处理(list)
        setListRights(state, data) {
            state.listRights = data
                // console.log(state.listRights);
        },
        // 权限信息的处理(tree)
        setTreeRights(state, data) {
            state.treeRights = data
                // console.log(state.treeRights);
        },
        // 当前选中用户权限信息的处理
        setEditRightsArr(state, data) {
            state.editRightsArr = data
                // console.log(state.editRightsArr);
        }
    },
    actions: {
        // 获取所有的角色列表
        async getAllRoles({ commit }) {
            let res = await api.getRoleList()
            if (res.meta.status === 200) {
                commit('setRolesArr', res.data)
            }
        },
        // 删除角色
        async delRole({ commit, dispatch }, id) {
            let res = await api.deleteRole(id)
            if (res.meta.status === 200) {
                Message.success(res.meta.msg)
                dispatch('getAllRoles')
            }
        },
        // 新增角色
        async addRoles({ commit, dispatch }, params) {
            let res = await api.addRole(params)
            if (res.meta.status === 201) {
                Message.success(res.meta.msg)
                dispatch('getAllRoles')
            }
        },
        // 编辑角色
        async editRoles({ dispatch }, { id, roleName, roleDesc }) {
            let res = await api.editRole({ id, roleName, roleDesc })
            if (res.meta.status === 200) {
                Message.success('修改成功')
                dispatch('getAllRoles')
            }
        },
        // 获取所有权限列表
        async getAllRight({ commit }, type) {
            let res = await api.getAllRights(type)
            if (res.meta.status === 200) {
                if (type === 'list') {
                    commit('setListRights', res.data)
                } else {
                    commit('setTreeRights', res.data)
                }
            }
        },
        // 角色授权
        async alloRights({ commit, dispatch }, { roleId, rids }) {
            let res = await api.roleRights({ roleId, rids })
            if (res.meta.status === 200) {
                Message.success(res.meta.msg)
                dispatch('getAllRoles')
            }
        },
        // 删除角色某一权限
        async delOneRight({ commit, dispatch }, { roleId, rightId }) {
            let res = await api.deleteRoleRight({ roleId, rightId })
            if (res.meta.status === 200) {
                Message.success('删除权限成功')
                commit('setEditRightsArr', res.data)
            }
        },
    },
    getters: {
        // 所有权限id
        rightsIdArr(state) {
            let idArr = []
            state.listRights.map(item => {
                if (item.level == '0' || item.level == '1') {
                    idArr.push(item.id)
                }
            })
            return idArr
        },
        // 当前选中角色id数组
        nowIdArr(state) {
            let nowidArr = []
            if (state.editRightsArr.length > 0) {
                state.editRightsArr.map(item => {
                    if (item.children.length > 0) {
                        item.children.map(item0 => {
                            if (item0.children.length > 0) {
                                item0.children.map(item1 => {
                                    nowidArr.push(item1.id)
                                })
                            }
                        })
                    }
                })
            }
            return nowidArr
        }
    },
}