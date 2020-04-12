// 默认导出一个对象既一个模块
import api from '../../http/api'
import { Message } from 'element-ui'
import router from '../../router'

export default {
    // 需要命名空间
    namespaced: true,
    state: {
        // 接收请求出来的商品总数据
        goodsObj: {}
    },
    mutations: {
        // 商品数据处理
        setGoodsObj(state, data) {
            state.goodsObj = data
            console.log(state.goodsObj);
        }
    },
    actions: {
        // 获取商品数据
        async getGoodsLists({ commit }, { pagenum, pagesize, query }) {
            try {
                let res = await api.getGoodsList({ pagenum, pagesize, query })
                if (res.meta.status === 200) {
                    commit('setGoodsObj', res.data)
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 删除商品
        async delGood({ commit }, id) {
            try {
                let res = await api.deleteGoods(id)
                if (res.meta.status === 200) {
                    Message.success(res.meta.msg)
                }
            } catch (err) {
                console.log(err);
            }
        }
    },
    getters: {},
}