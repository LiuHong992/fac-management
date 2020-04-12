<template>
  <div>
    <el-card>
      <!-- 顶部搜索框和添加按钮 -->
      <div class="top fl a-c m-b-20">
        <!-- 搜索框 -->
        <div class="search-wrapper m-r-20">
          <el-input placeholder="请输入搜索内容" v-model="gSearch">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
        <!-- 添加用户按钮 -->
        <div class="btn">
          <el-button type="primary" @click="addDialog = true">添加商品</el-button>
        </div>
      </div>
      <!-- 表格数据 -->
      <div class="table">
        <el-table :data="goodsObj.goods" style="width: 100%">
          <!-- 编号 -->
          <el-table-column label="#" width="50" align="center">
            <template slot-scope="scope">
              <span>{{ scope.$index+1+pagesize*(pagenum-1)}}</span>
            </template>
          </el-table-column>
          <!-- 商品名称 -->
          <el-table-column label="商品名称" width="580" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_name }}</span>
            </template>
          </el-table-column>
          <!-- 商品价格(元) -->
          <el-table-column label="商品价格(元)" width="140" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_price }}</span>
            </template>
          </el-table-column>
          <!-- 商品重量 -->
          <el-table-column label="商品重量" width="100" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_weight }}</span>
            </template>
          </el-table-column>
          <!-- 创建时间 -->
          <el-table-column label="创建时间" width="180" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.add_time | formatTime }}</span>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <!-- 编辑商品 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editInfo(scope.row)"
              ></el-button>
              <!-- 删除商品 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delInfo(scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <pagination
          :pagenum="pagenum"
          :pagesize="pagesize"
          :maxpage="maxpage"
          :total="goodsObj.total"
          @changeSize="changeSize"
          @changeNum="changeNum"
        ></pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { createNamespacedHelpers } from "vuex";
const goodsModule = createNamespacedHelpers("Goods");
const { mapState: goodState, mapActions: goodActions } = goodsModule;
import pagination from "../../components/User/Pagination";
export default {
  data() {
    return {
      // 当前页数
      pagenum: 1,
      // 每页最大数
      pagesize: 10,
      // 每页最大数数组
      maxpage: [10, 30, 50, 100],
      // 搜索参数
      gSearch: "",
      // 编辑商品框状态
      editDialog: false
    };
  },
  components: {
    pagination
  },
  methods: {
    ...goodActions(["getGoodsLists", "delGood"]),
    // 更新数据的方法
    getGoods() {
      this.getGoodsLists({
        pagenum: this.pagenum,
        pagesize: this.pagesize,
        query: this.gSearch
      });
    },
    // 分页组件分发回父组件的改变最大页数的方法
    changeSize(e) {
      this.pagesize = e;
      setTimeout(() => {
        this.getGoods();
      }, 50);
    },
    // 分页组件分发回父组件的改变当前页数的方法
    changeNum(e) {
      this.pagenum = e;
      setTimeout(() => {
        this.getGoods();
      }, 50);
    },
    // 编辑操作
    editInfo(info) {},
    // 删除操作
    delInfo(info) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delGood(info.goods_id);
          setTimeout(() => {
            this.getGoods();
          }, 80);
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
    this.getGoods();
  },
  watch: {},
  computed: {
    ...goodState(["goodsObj"])
  },
  filters: {
    formatTime(data) {
      let time = null;
      time = dayjs(data).format("YYYY-MM-DD hh:mm:ss");
      return time;
    }
  }
};
</script>

<style scoped lang='scss'>
.top {
  .search-wrapper {
    width: 30%;
  }
}
</style>