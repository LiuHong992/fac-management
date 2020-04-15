<template>
  <div>
    <zk-table
      ref="table"
      sum-text="sum"
      index-text="#"
      :data="classfyObj.result"
      :columns="columns"
      :stripe="props.stripe"
      :border="props.border"
      :show-header="props.showHeader"
      :show-summary="props.showSummary"
      :show-row-hover="props.showRowHover"
      :show-index="props.showIndex"
      :tree-type="props.treeType"
      :is-fold="props.isFold"
      :expand-type="props.expandType"
      :selection-type="props.selectionType"
    >
      <!-- 是否有效状态栏 -->
      <template slot="cat_deleted">
        <i class="el-icon-success" style="color:skyblue"></i>
      </template>
      <!-- 排序栏 -->
      <template slot="cat_level" slot-scope="scope">
        <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
        <el-tag size="mini" type="success" v-if="scope.row.cat_level === 1">二级</el-tag>
        <el-tag size="mini" type="warning" v-if="scope.row.cat_level === 2">三级</el-tag>
      </template>
      <!-- 操作 -->
      <template slot="operation" slot-scope="scope">
        <el-button
          @click="editCategorys(scope.row)"
          size="mini"
          type="primary"
          icon="el-icon-edit"
        >编辑</el-button>
        <el-button
          @click="deleteCategorys(scope.row)"
          size="mini"
          type="danger"
          icon="el-icon-delete"
        >删除</el-button>
      </template>
    </zk-table>
    <!-- 分页组件 -->
    <pagination
      :pagenum="pagenum"
      :pagesize="pagesize"
      :maxpage="maxpage"
      :total="classfyObj.total"
      @changeSize="changeSize"
      @changeNum="changeNum"
    ></pagination>
  </div>
</template>

<script>
import pagination from "../../components/User/Pagination";
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
      // 当前页数
      pagenum: 1,
      // 当前页最大数
      pagesize: 5,
      // 每页最大数数组
      maxpage: [5, 10, 20, 30],
      props: {
        stripe: false, //是否显示间隔斑马纹
        border: true, //是否显示纵向边框
        showHeader: true, //是否显示表头
        showSummary: false, //是否显示表尾合计行
        showRowHover: false, //鼠标悬停时，是否高亮当前行
        showIndex: true, //是否显示数据索引
        treeType: true, //是否为树形表格
        isFold: true, //树形表格中父级是否默认折叠
        expandType: false, //是否为展开行类型表格（为 True 时，需要添加作用域插槽, 它可以获取到 row, rowIndex)
        selectionType: false //是否显示间隔斑马纹
      },
      //表格标题数据
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
          //   minWidth: "285px"
        },
        {
          label: "是否有效",
          type: "template",
          template: "cat_deleted",
          headerAlign: "center",
          align: "center"
        },
        {
          label: "排序",
          type: "template",
          template: "cat_level",
          headerAlign: "center",
          align: "center"
        },
        {
          label: "操作",
          type: "template",
          template: "operation",
          headerAlign: "center",
          align: "center"
        }
      ]
    };
  },
  props: {},
  components: {
    pagination
  },
  methods: {
    ...goodActions(["getClassfies", "getCategoryByIds", "delCategory"]),
    // 更新数据的方法
    getCategories() {
      this.getClassfies({
        pagenum: this.pagenum,
        pagesize: this.pagesize,
        type: 3
      });
    },
    // 分页组件分发回父组件的改变最大页数的方法
    changeSize(e) {
      this.pagesize = e;
      setTimeout(() => {
        this.getCategories();
      }, 50);
    },
    // 分页组件分发回父组件的改变当前页数的方法
    changeNum(e) {
      this.pagenum = e;
      setTimeout(() => {
        this.getCategories();
      }, 50);
    },
    // 编辑框打开
    editCategorys(info) {
      this.$emit("editCategorys", true, this.pagenum, this.pagesize);
      this.getCategoryByIds(info.cat_id);
    },
    // 删除操作
    deleteCategorys(info) {
      this.$confirm("此操作将永久删除该选项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delCategory(info.cat_id);
          setTimeout(() => {
            this.getCategories();
          }, 200);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消了删除"
          });
        });
    }
  },
  mounted() {
    this.getCategories();
  },
  watch: {},
  computed: {
    ...goodState(["classfyObj"])
  },
  filters: {}
};
</script>

<style scoped lang='scss'>
</style>