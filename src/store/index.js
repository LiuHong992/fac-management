import Vue from 'vue'
import Vuex from 'vuex'
import User from './User/index'
import Home from './Home/index'
import Rights from './Rights/index'
import Goods from './Goods/index'
import Order from './Order/index'
import api from '../http/api'

Vue.use(Vuex)

// 只放公共的状态
export default new Vuex.Store({
    state: {
        // 报表数据
        reportsData: {}
    },
    mutations: {
        // 报表数据处理
        setReportsData(state, data) {
            state.reportsData = data
        }
    },
    actions: {
        // 请求报表数据
        async getReports({ commit }) {
            try {
                let res = await api.getLineChart()
                if (res) {
                    commit('setReportsData', res.data)
                }
            } catch (err) {
                console.log(err);
            }
        }
    },
    modules: {
        User,
        Home,
        Rights,
        Goods,
        Order
    }
})