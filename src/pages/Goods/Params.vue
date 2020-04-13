<template>
  <div class="params-wrapper">
    <el-card>
      <!-- 头部的提示信息 -->
      <el-alert title="注意:只允许为第三级分类设置相关参数!" type="warning" :closable="false" show-icon></el-alert>
      <!-- 选择框 -->
      <div class="select fl a-c m-t-20 m-b-20">
        <div class="desc f-s-18 m-r-20">选择商品分类:</div>
        <!-- 级联选择器 -->
        <div class="cascader">
          <el-cascader
            v-model="nowId"
            :options="classfyArr"
            :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name' }"
            @change="handleChange"
          ></el-cascader>
        </div>
      </div>
      <!-- tab栏 -->
      <div class="tab">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="动态参数" name="many">
            <params-tab selType="many" :nowId="nowId"></params-tab>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
            <params-tab selType="only" :nowId="nowId"></params-tab>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
import paramsTab from "../../components/Goods/ParamsTab";
import { createNamespacedHelpers } from "vuex";
const goodsModule = createNamespacedHelpers("Goods");
const {
  mapState: goodState,
  mapActions: goodActions,
  mapMutations: goodMutations
} = goodsModule;
export default {
  data() {
    return {
      nowId: [],
      // tab栏当前选中项
      activeName: "many"
    };
  },
  components: {
    paramsTab
  },
  methods: {
    ...goodActions(["getClassfies", "getCategory"]),
    ...goodMutations(["setParamsArr"]),
    // 级联选择器方法
    handleChange() {
      this.getCategory({
        id: this.nowId[2],
        sel: this.activeName
      });
    },
    // tab栏方法
    handleClick() {
      this.getCategory({
        id: this.nowId[2],
        sel: this.activeName
      });
    }
  },
  mounted() {
    this.getClassfies({ type: 3 });
  },
  watch: {
  },
  computed: {
    ...goodState(["classfyArr", "paramsArr"])
  },
  filters: {}
};
</script>

<style scoped lang='scss'>
</style>