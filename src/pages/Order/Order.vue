<template>
  <div>
    <el-card>
      <!-- 头部搜索框 -->
      <div class="top fl m-b-20">
        <div class="search m-r-20">
          <el-input placeholder="请输入搜索内容" v-model="oSearch">
            <el-button slot="append" icon="el-icon-search" @click="updateOrders"></el-button>
          </el-input>
        </div>
      </div>
      <!-- 表格内容 -->
      <div class="table">
        <el-table :data="orderObj.goods" border stripe style="width: 100%">
          <!-- 序号 -->
          <el-table-column label="#" width="105" align="center">
            <template slot-scope="scope">
              <span>{{ scope.$index+1+((pagenum-1)*pagesize) }}</span>
            </template>
          </el-table-column>
          <!-- 订单编号 -->
          <el-table-column label="订单编号" width="190" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.order_number }}</span>
            </template>
          </el-table-column>
          <!-- 订单价格 -->
          <el-table-column label="订单价格" width="185" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.order_price }}</span>
            </template>
          </el-table-column>
          <!-- 是否付款 -->
          <el-table-column label="是否付款" width="182" align="center">
            <el-tag type="danger">已付款</el-tag>
          </el-table-column>
          <!-- 是否发货 -->
          <el-table-column label="是否发货" width="184" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.is_send }}</span>
            </template>
          </el-table-column>
          <!-- 下单时间 -->
          <el-table-column label="下单时间" width="185" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.create_time | formatTime }}</span>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作" width="182" align="center">
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
                type="success"
                icon="el-icon-location"
                size="mini"
                @click="lookLogistics(scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <pagination
          :pagenum="pagenum"
          :pagesize="pagesize"
          :maxpage="maxpage"
          :total="orderObj.total"
          @changeSize="changeSize"
          @changeNum="changeNum"
        ></pagination>
      </div>
      <!-- 物流dialog框 -->
      <el-dialog title="物流信息" :visible.sync="logFlag" width="40%">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in logArr"
            :key="index"
            :timestamp="activity.ftime"
            size="large"
          >{{activity.context}}</el-timeline-item>
        </el-timeline>
      </el-dialog>
      <!-- 编辑地址dialog -->
      <el-dialog title="编辑地址" :visible.sync="editFlag" width="40%" @close="handleClose">
        <el-cascader v-model="address" :options="regionData" style="width:100%"></el-cascader>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { regionData } from "../../utils/cityData";
import dayjs from "dayjs";
import { createNamespacedHelpers } from "vuex";
const orderModule = createNamespacedHelpers("Order");
const {
  mapState: orderState,
  mapActions: orderActions,
  mapMutations: orderMutations
} = orderModule;
import pagination from "../../components/User/Pagination";
export default {
  data() {
    return {
      // 当前页数
      pagenum: 1,
      // 每页最大数
      pagesize: 5,
      // 每页最大数数组
      maxpage: [5, 15, 20, 30],
      // 搜索参数
      oSearch: "",
      // 物流订单号(默认)
      oId: 804909574412544600,
      // 物流框的状态
      logFlag: false,
      // 编辑地址框的状态
      editFlag: false,
      regionData,
      address: []
    };
  },
  components: {
    pagination
  },
  methods: {
    ...orderActions(["getAllOrders", "getLogistics"]),
    // 更新数据的方法
    updateOrders() {
      this.getAllOrders({
        pagenum: this.pagenum,
        pagesize: this.pagesize,
        query: this.oSearch
      });
    },
    // 分页组件分发回父组件的改变最大页数的方法
    changeSize(e) {
      this.pagesize = e;
      setTimeout(() => {
        this.updateOrders();
      }, 50);
    },
    // 分页组件分发回父组件的改变当前页数的方法
    changeNum(e) {
      this.pagenum = e;
      setTimeout(() => {
        this.updateOrders();
      }, 50);
    },
    // 打开地址选择框
    editInfo(info) {
      this.editFlag = true;
    },
    // 查看物流信息
    lookLogistics(info) {
      this.logFlag = true;
      this.getLogistics(this.oId);
    },
    // 地址级联选择器关闭回调
    handleClose() {
      this.address = [];
    }
  },
  mounted() {
    this.updateOrders();
  },
  watch: {},
  computed: {
    ...orderState(["orderObj", "logArr"])
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
  .search {
    width: 30%;
  }
}
</style>