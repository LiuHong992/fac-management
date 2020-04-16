<template>
  <div class="add-wrapper">
    <!-- 顶部步骤条 -->
    <div class="top m-b-20">
      <el-alert title="添加商品信息" type="info" :closable="false" center show-icon></el-alert>
      <!-- 步骤条 -->
      <div class="steps m-t-30">
        <el-steps :active="active" finish-status="success">
          <el-step :title="item.title" v-for="(item,index) in stepsArr" :key="index"></el-step>
        </el-steps>
      </div>
    </div>
    <!-- 下方的具体步骤栏 -->
    <div class="bot">
      <div class="tabs">
        <el-tabs tab-position="left" :value="currentTab" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="0">
            <basic-info @nextTo="nextTo"></basic-info>
          </el-tab-pane>
          <el-tab-pane label="商品参数" :disabled="tabsNum>=0 && tabsNum<1" name="1">
            <add-params @nextTo="nextTo"></add-params>
          </el-tab-pane>
          <el-tab-pane label="商品属性" :disabled="tabsNum>=0 && tabsNum<2" name="2">
            <attributes @nextTo="nextTo"></attributes>
          </el-tab-pane>
          <el-tab-pane label="商品图片" :disabled="tabsNum>=0 && tabsNum<3" name="3">
            <goodsImage @nextTo="nextTo"></goodsImage>
          </el-tab-pane>
          <el-tab-pane label="商品内容" :disabled="tabsNum>=0 && tabsNum<4" name="4">
            <goodsContent @submit="submit"></goodsContent>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import basicInfo from "../../components/Goods/BasicInfo";
import addParams from "../../components/Goods/AddParams";
import attributes from "../../components/Goods/Attributes";
import goodsImage from "../../components/Goods/GoodsImage";
import goodsContent from "../../components/Goods/GoodsContent";
import { createNamespacedHelpers } from "vuex";
const goodsModule = createNamespacedHelpers("Goods");
const { mapActions: goodActions } = goodsModule;
export default {
  data() {
    return {
      active: 0,
      // 步骤条状态数组
      stepsArr: [
        {
          title: "基本信息"
        },
        {
          title: "商品参数"
        },
        {
          title: "商品属性"
        },
        {
          title: "商品图片"
        },
        {
          title: "商品内容"
        },
        {
          title: "完成"
        }
      ],
      // 商品相关参数
      goodsObj: {
        // 商品名
        goods_name: "",
        // 商品价格
        goods_price: "",
        // 商品重量
        goods_weight: "",
        // 商品数量
        goods_number: "",
        // 商品分类
        goods_cat: "",
        // 商品参数(可以为空)
        attrs: [],
        // 商品图片(可以为空)
        pics: [],
        // 商品介绍
        goods_introduce: ""
      },
      // 标签的选中状态
      tabsNum: 0
    };
  },
  components: {
    basicInfo,
    addParams,
    attributes,
    goodsImage,
    goodsContent
  },
  methods: {
    ...goodActions(["addGoodsItem"]),
    // 子组件分发回父组件的事件
    nextTo(num, info) {
      if (num == 1) {
        this.goodsObj.goods_name = info.goods_name;
        this.goodsObj.goods_price = Number(info.goods_price);
        this.goodsObj.goods_weight = Number(info.goods_weight);
        this.goodsObj.goods_number = Number(info.goods_number);
        this.goodsObj.goods_cat = info.goods_cat;
        console.log(this.goodsObj);
      }
      if (num > this.tabsNum) {
        this.active = num;
        this.tabsNum = num;
      } else {
        this.active = num;
      }
    },
    // tab栏切换
    handleClick(e) {
      // console.log(e);
    },
    // 提交按钮
    submit(desc) {
      this.goodsObj.goods_introduce = desc;
      setTimeout(() => {
        this.addGoodsItem(this.goodsObj);
      }, 200);
    }
  },
  mounted() {},
  watch: {},
  computed: {
    currentTab() {
      return this.active.toString();
    }
  },
  filters: {}
};
</script>

<style scoped lang='scss'>
.add-wrapper {
  .top {
    margin-left: 120px;
  }
  .bot {
    height: 100%;
  }
}
</style>