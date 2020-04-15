<template>
  <div>
    <el-card>
      <!-- 顶部搜索框和添加按钮 -->
      <div class="top fl a-c m-b-20">
        <!-- 搜索框 -->
        <div class="search-wrapper m-r-20">
          <el-input clearable placeholder="请输入搜索内容" v-model="gSearch">
            <el-button slot="append" icon="el-icon-search" @click="getGoods"></el-button>
          </el-input>
        </div>
        <!-- 添加商品按钮 -->
        <div class="btn">
          <el-button type="primary" @click="goToAddGoods">添加商品</el-button>
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
    <!-- 编辑框dialog -->
    <el-dialog title="编辑商品" :visible.sync="editDialog" width="40%">
      <el-form
        :model="editObj"
        :rules="rules"
        ref="ruleForm"
        label-position="right"
        label-width="100px"
      >
        <!-- 商品名称 -->
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editObj.goods_name"></el-input>
        </el-form-item>
        <!-- 商品价格 -->
        <el-form-item label="商品价格" prop="goods_price">
          <el-input type="number" min="0" v-model="editObj.goods_price"></el-input>
        </el-form-item>
        <!-- 商品数量 -->
        <el-form-item label="商品数量" prop="goods_number">
          <el-input type="number" min="0" v-model="editObj.goods_number"></el-input>
        </el-form-item>
        <!-- 商品重量 -->
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input type="number" min="0" v-model="editObj.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="editconfirm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { createNamespacedHelpers } from "vuex";
const homeMudule = createNamespacedHelpers("Home");
const goodsModule = createNamespacedHelpers("Goods");
const {
  mapState: goodState,
  mapActions: goodActions,
  mapMutations: goodMutations
} = goodsModule;
const { mapState: homeState, mapMutations: homeMutations } = homeMudule;
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
      editDialog: false,
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
      }
    };
  },
  components: {
    pagination
  },
  methods: {
    ...goodActions(["getGoodsLists", "delGood", "getById"]),
    // 首页模块
    ...homeMutations(["setTabList"]),
    // ...goodMutations(["setEditObj"]),
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
    // 跳转到添加商品页面
    goToAddGoods() {
      let obj = {
        name: "添加商品",
        url: "/goods/addgoods"
      };
      let flag = true;
      this.tabList.map(item => {
        if (item.name === obj.name) {
          flag = false;
        }
      });
      if (flag) {
        this.tabList.push(obj);
        setTimeout(() => {
          this.setTabList(this.tabList);
        }, 20);
        setTimeout(() => {
          this.$router.push(obj.url);
          localStorage.setItem("tabList", JSON.stringify(this.tabList));
        }, 50);
      } else {
        this.$router.push(obj.url);
      }
    },
    // 编辑操作
    editInfo(info) {
      this.editDialog = true;
      this.getById(info.goods_id);
    },
    // 取消(添加)按钮
    cancel(formName) {
      this.editDialog = false;
      if (formName) {
        this.$refs[formName].resetFields();
      }
    },
    // 编辑角色确定按钮
    editconfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.editDialog = false;
          this.$message.error("商品没有设置所属分类");
        } else {
          return false;
        }
      });
    },
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
    // if (localStorage.getItem("tabList")) {
    //   this.setTabList(JSON.parse(localStorage.getItem("tabList")));
    // }
  },
  watch: {},
  computed: {
    ...goodState(["goodsObj", "editObj"]),
    ...homeState(["tabList"])
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