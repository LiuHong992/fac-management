// 默认导出一个对象既一个模块
import api from '../../http/api'
import { Message } from 'element-ui'
import router from '../../router'

export default {
    // 需要命名空间
    namespaced: true,
    state: {
        // 接收请求出来的订单数据
        orderObj: {},
        // 物流详情数组
        logArr: []
    },
    mutations: {
        // 订单数据信息处理
        setOrderObj(state, data) {
            state.orderObj = data
        },
        // 物流信息处理
        setLogArr(state, data) {
            state.logArr = data
                // console.log(state.logArr);
        }
    },
    actions: {
        // 获取(所有)订单数据
        async getAllOrders({ commit }, { pagenum, pagesize, query }) {
            try {
                let res = await api.getOrderList({ pagenum, pagesize, query })
                if (res.meta.status === 200) {
                    commit('setOrderObj', res.data)
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 查看物流详情
        async getLogistics({ commit }, id) {
            try {
                let res = await api.checkLogistics(id)
                if (res.meta.status === 200) {
                    commit('setLogArr', res.data)
                }
            } catch (err) {
                console.log(err);
            }
        },
    },
    getters: {},
}