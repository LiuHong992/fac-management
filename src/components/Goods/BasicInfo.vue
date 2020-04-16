<template>
  <div class="m-l-15">
    <div class="container">
      <el-form :model="infos" :rules="rules" ref="infoForm" label-width="100px">
        <!-- 商品名称 -->
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="infos.goods_name"></el-input>
        </el-form-item>
        <!-- 商品价格 -->
        <el-form-item label="商品价格" prop="goods_price">
          <el-input
            type="number"
            min="0"
            v-model="infos.goods_price"
            :disabled="infos.goods_name.trim() === ''"
          ></el-input>
        </el-form-item>
        <!-- 商品数量 -->
        <el-form-item label="商品数量" prop="goods_number">
          <el-input
            type="number"
            min="1"
            v-model="infos.goods_number"
            :disabled="infos.goods_name.trim() === '' || infos.goods_price===''"
          ></el-input>
        </el-form-item>
        <!-- 商品重量 -->
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input
            type="number"
            min="1"
            v-model="infos.goods_weight"
            :disabled="infos.goods_name.trim() === '' || infos.goods_price==='' || infos.goods_number===''"
          ></el-input>
        </el-form-item>
        <!-- 商品分类 -->
        <el-form-item label="商品分类" prop="goods_cat">
          <el-cascader
            style="width:30%"
            v-model="nowId"
            :options="classfyArr"
            :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name' }"
            @change="handleChange"
            :disabled="infos.goods_name.trim() === '' || infos.goods_price==='' || infos.goods_number==='' || infos.goods_weight === ''"
          ></el-cascader>
        </el-form-item>
        <!-- 下一步 -->
        <el-form-item>
          <el-button
            type="success"
            size="mini"
            @click="nextTo"
            v-if="infos.goods_name.trim() !== '' && infos.goods_price!=='' && infos.goods_number!=='' && infos.goods_weight !== '' && infos.goods_cat !==''"
          >下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
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
      infos: {
        // 商品名
        goods_name: "",
        // 商品价格
        goods_price: "",
        // 商品重量
        goods_weight: "",
        // 商品数量
        goods_number: "",
        // 商品分类
        goods_cat: ""
      },
      // 表单验证规则
      rules: {
        goods_name: [
          { required: true, message: "商品名称不能为空", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "商品价格不能为空", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "商品数量不能为空", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "商品重量不能为空", trigger: "blur" }
        ]
      },
      // 控制表单每一行的显示状态的参数
      formNum: 0
    };
  },
  components: {},
  methods: {
    ...goodActions(["getClassfies"]),
    // 级联选择器方法
    handleChange() {
      this.infos.goods_cat = this.nowId.toString();
    },
    // 下一步按钮
    nextTo() {
      let num = 1;
      this.$emit("nextTo", num, this.infos);
    }
  },
  mounted() {
    this.getClassfies({ type: 3 });
  },
  watch: {},
  computed: {
    ...goodState(["classfyArr"])
  },
  filters: {}
};
</script>

<style scoped lang='scss'>
</style>