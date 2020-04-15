// 默认导出一个对象既一个模块
import api from '../../http/api'
import { Message } from 'element-ui'
import router from '../../router'

export default {
    // 需要命名空间
    namespaced: true,
    state: {
        // 接收请求出来的商品总数据
        goodsObj: {},
        // 当前选中的角色(商品、用户)
        editObj: {},
        // 接收请求到的分类数据
        classfyArr: [],
        // 接收参数列表(动态和静态均为这个参数接收)
        paramsArr: [],
        // 当前选中的编辑项(参数)
        editParam: {},
        // 接收分类总数据
        classfyObj: {},
        // 接收当前选中项的详细信息
        editCategory: {}
    },
    mutations: {
        // 商品数据处理
        setGoodsObj(state, data) {
            state.goodsObj = data
                // console.log(state.goodsObj);
        },
        // 当前用户的处理
        setEditObj(state, data) {
            state.editObj = data
                // console.log(state.editObj);
        },
        // 所有分类的处理
        setClassfyArr(state, data) {
            state.classfyArr = data
            console.log(state.classfyArr);
        },
        // 参数列表信息的处理
        setParamsArr(state, data) {
            state.paramsArr = data
        },
        // 当前选中项的信息处理
        setEditParam(state, data) {
            state.editParam = data
                // console.log(state.editParam);
        },
        // 分类总数据的处理
        setClassfyObj(state, data) {
            state.classfyObj = data
                // console.log(state.classfyObj);
        },
        // 当前分类数据的处理
        setEditCategory(state, data) {
            state.editCategory = data
            console.log(state.editCategory);
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
        },
        // 根据id查询商品
        async getById({ commit }, id) {
            try {
                let res = await api.getGoodsById(id)
                if (res.meta.status === 200) {
                    commit('setEditObj', res.data)
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 分类参数相关请求
        // 获取分类列表
        async getClassfies({ commit }, { pagenum, pagesize, type }) {
            try {
                if (pagenum && pagesize) {
                    let res = await api.getGoodsCategories({ pagenum, pagesize, type })
                    if (res.meta.status === 200) {
                        commit('setClassfyObj', res.data)
                    }
                } else {
                    let res = await api.getGoodsCategories({ type })
                    if (res.meta.status === 200) {
                        commit('setClassfyArr', res.data)
                    }
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 获取对应的参数列表
        async getCategory({ commit }, { id, sel }) {
            try {
                let res = await api.getAttributesList({ id, sel })
                if (res.meta.status === 200) {
                    commit('setParamsArr', res.data)
                        // console.log(res);
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 新增参数
        async addParam({ commit }, { id, attr_name, attr_sel }) {
            try {
                let res = await api.addAttributes({ id, attr_name, attr_sel })
                if (res.meta.status === 200) {
                    Message.success(res.meta.msg)
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 删除参数
        async delParam({ dispatch }, { id, attrid }) {
            try {
                let res = await api.deleteAttributes({ id, attrid })
                if (res.meta.status === 200) {
                    Message.success(res.meta.msg)
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 根据ID获取到对应的参数信息
        async getParamById({ commit }, { id, attrid, attr_sel, attr_vals }) {
            try {
                let res = await api.getAttributesById({ id, attrid, attr_sel, attr_vals })
                if (res.meta.status === 200) {
                    commit('setEditParam', res.data)
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 编辑参数确定按钮
        async confirmEditParam({ dispatch }, { id, attrid, attr_name, attr_sel, attr_vals }) {
            try {
                let res = await api.editAttributes({ id, attrid, attr_name, attr_sel, attr_vals })
                if (res.meta.status === 200) {
                    Message.success(res.meta.msg)
                        // dispatch('getCategory', { id, attr_sel })
                }
            } catch (err) {
                console.log(err);
            }
        },

        //商品分类相关接口
        // 根据id查询相关分类
        async getCategoryByIds({ commit }, id) {
            try {
                let res = await api.getCategoryById(id)
                if (res.meta.status === 200) {
                    commit('setEditCategory', res.data)
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 修改分类
        async changeCategory({ commit }, { id, cat_name }) {
            try {
                let res = await api.editCategory({ id, cat_name })
                if (res.meta.status === 200) {
                    Message.success(res.meta.msg)
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 添加分类
        async addCategories({ commit }, { cat_pid, cat_name, cat_level }) {
            try {
                let res = await api.addCategory({ cat_pid, cat_name, cat_level })
                if (res.meta.status === 201) {
                    Message.success(res.meta.msg)
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 删除分类
        async delCategory({ commit }, id) {
            try {
                let res = await api.deleteCategory(id)
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