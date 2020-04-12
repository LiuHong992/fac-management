import Vue from 'vue'
import Vuex from 'vuex'
import User from './User/index'
import Home from './Home/index'
import Rights from './Rights/index'
import Goods from './Goods/index'

Vue.use(Vuex)

// 只放公共的状态
export default new Vuex.Store({
    state: {
        // 当前选中的角色(商品、用户)
        editObj: {},
    },
    mutations: {
        // 当前用户的处理
        setEditObj(state, data) {
            state.editObj = data
            console.log(state.editObj);
        },
    },
    actions: {},
    modules: {
        User,
        Home,
        Rights,
        Goods
    }
})