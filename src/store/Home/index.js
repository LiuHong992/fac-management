// 默认导出一个对象既一个模块
import api from '../../http/api'
import { Message } from 'element-ui'
import router from '../../router'

export default {
    // 需要命名空间
    namespaced: true,
    state: {
        // 图标数组
        iconArr: [{
                faicon: "user",
                children: [{
                    chilicon: "folder-opened"
                }]
            },
            {
                faicon: "folder",
                children: [{
                        chilicon: "setting"
                    },
                    {
                        chilicon: "c-scale-to-original"
                    }
                ]
            },
            {
                faicon: "shopping-bag-2",
                children: [{
                        chilicon: "bangzhu"
                    },
                    {
                        chilicon: "bell"
                    },
                    {
                        chilicon: "date"
                    }
                ]
            },
            {
                faicon: "s-order",
                children: [{
                    chilicon: "folder-add"
                }]
            },
            {
                faicon: "message",
                children: [{
                    chilicon: "position"
                }]
            }
        ],
        // 接收获取到的用户权限列表
        rightsList: [],
        // 接收缓存中的选中项数组
        tabList: [],
        // 当前选中项
        defaultActive: '/'
    },
    mutations: {
        // 用户权限列表信息的处理
        setRightsList(state, data) {
            state.rightsList = data
                // console.log(state.rightsList);
        },
        // 导航栏标签数组信息处理
        setDefaultActive(state, data) {
            state.defaultActive = data
        },
        // 选中项数组处理
        setTabList(state, data) {
            state.tabList = data
        }
    },
    actions: {
        // 获取登录后相关登录者的侧边栏
        async getAllMenu({ commit }) {
            let res = await api.getMenus()
            if (res.meta.status === 200) {
                commit('setRightsList', res.data)
            }
        }
    },
    getters: {
        getNewRightsList(state) {
            if (state.rightsList.length > 0) {
                // 外层导航循环
                state.rightsList.map((item, index) => {
                    state.iconArr.map((item0, index0) => {
                        if (index0 === index) {
                            // 内层导航循环
                            item.faicon = item0.faicon
                            if (item.children.length > 0) {
                                item.children.map((item1, index1) => {
                                    item0.children.map((item2, index2) => {
                                        if (index2 === index1) {
                                            item1.chilicon = item2.chilicon
                                        }
                                    })
                                })
                            }
                        }
                    })
                })
                return state.rightsList
            }
        }
    },
}