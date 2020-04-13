<template>
  <div :class="`pane-${selType}`">
    <!-- 添加按钮 -->
    <div class="add-btn">
      <el-button
        size="mini"
        type="primary"
        :disabled="nowId.length===0"
        @click="openAdd"
      >添加{{selType==='many'?'参数':'属性'}}</el-button>
    </div>
    <!-- 下方的表格数据 -->
    <el-table :data="paramsArr" style="width: 100%" @expand-change="shwoTags">
      <!-- index -->
      <el-table-column label="#" prop="index" width="50" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <!-- 展开行 -->
      <el-table-column type="expand" width="50">
        <el-tag
          class="m-r-20"
          :key="index"
          v-for="(item,index) in valsArr"
          closable
          :disable-transitions="false"
          @close="handleClose(item)"
        >{{item}}</el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        ></el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
      </el-table-column>
      <!-- 参数名称 -->
      <el-table-column label="参数名称" prop="pname" width="550" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.attr_name }}</span>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" width="550" align="center">
        <template slot-scope="scope">
          <!-- 编辑商品 -->
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editInfo(scope.row)">编辑</el-button>
          <!-- 删除商品 -->
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="delInfo(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑dialog -->
    <el-dialog :title="`修改${editDialogText}`" :visible.sync="editFlag" width="30%">
      <el-form
        :model="editParam"
        :rules="rules"
        ref="editForm"
        label-position="right"
        label-width="100px"
      >
        <el-form-item :label="editDialogText" prop="attr_name">
          <el-input v-model="editParam.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel('editForm')">取 消</el-button>
        <el-button type="primary" @click="confirm('editForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增参数dialog -->
    <el-dialog :title="`添加${editDialogText}`" :visible.sync="addFlag" width="30%">
      <el-form
        :model="addObj"
        :rules="rules"
        ref="addForm"
        label-position="right"
        label-width="100px"
      >
        <el-form-item :label="editDialogText" prop="attr_name">
          <el-input v-model="addObj.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel('addForm')">取 消</el-button>
        <el-button type="primary" @click="confirm('addForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const goodsModule = createNamespacedHelpers("Goods");
const {
  mapState: goodState,
  mapActions: goodActions,
  mapMutations: goodMutations,
  mapGetters: goodGetters
} = goodsModule;
export default {
  data() {
    return {
      // 编辑框状态
      editFlag: false,
      // 新增框状态
      addFlag: false,
      // 编辑框验证规则
      rules: {
        attr_name: [
          { required: true, message: "参数名不能为空", trigger: "blur" },
          { min: 2, max: 10, message: "参数名在2到10个字符", trigger: "blur" }
        ]
      },
      // 参数相关信息
      addObj: {
        attr_name: ""
      },
      valsArr: [],
      inputVisible: false,
      // 添加标签输入框的值
      inputValue: ""
    };
  },
  props: {
    // 参数类型
    selType: {
      type: String,
      default: "many"
    },
    // 判断依据
    nowId: {
      type: Array,
      default: () => []
    }
  },
  components: {},
  methods: {
    ...goodActions([
      "delParam",
      "getCategory",
      "getParamById",
      "confirmEditParam",
      "addParam"
    ]),
    ...goodMutations(["setEditParam"]),
    // 更新信息的方法
    updateParams() {
      this.getCategory({
        id: this.nowId[2],
        sel: this.selType
      });
    },
    // 表格展开行触发的方法
    shwoTags(row) {
      this.valsArr = [];
      this.setEditParam(row);
      if (this.editParam.attr_vals !== "") {
        this.valsArr = this.editParam.attr_vals.split(" ");
      }
      //   console.log(row);
    },
    // 表格中的新增操作
    openAdd() {
      this.addFlag = true;
    },
    // 表格中编辑操作
    editInfo(info) {
      this.editFlag = true;
      this.getParamById({
        id: info.cat_id,
        attrid: info.attr_id,
        attr_sel: this.selType,
        attr_vals: info.attr_vals
      });
    },
    // 取消(添加)按钮
    cancel(formName) {
      this.editFlag = false;
      this.addFlag = false;
      this.$refs[formName].resetFields();
    },
    // 新增角色确定按钮
    confirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.editFlag = false;
          this.addFlag = false;
          if (formName === "editForm") {
            this.confirmEditParam({
              id: this.editParam.cat_id,
              attrid: this.editParam.attr_id,
              attr_name: this.editParam.attr_name,
              attr_sel: this.selType,
              attr_vals: this.editParam.attr_vals
            });
          } else {
            this.addParam({
              id: this.nowId[2],
              attr_name: this.addObj.attr_name,
              attr_sel: this.selType
            });
          }
          setTimeout(() => {
            this.updateParams();
            this.$refs[formName].resetFields();
          }, 200);
        } else {
          return false;
        }
      });
    },
    // 删除dilog打开
    delInfo(info) {
      this.$confirm("此操作将永久删除该选项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delParam({ id: info.cat_id, attrid: info.attr_id });
          setTimeout(() => {
            this.updateParams();
          }, 200);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消了删除"
          });
        });
    },
    // 展开行中间的删除按钮
    handleClose(tag) {
      this.valsArr.splice(this.valsArr.indexOf(tag), 1);
    },
    // 添加标签
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    }
  },
  mounted() {},
  watch: {},
  computed: {
    ...goodState(["paramsArr", "editParam"]),
    // ...goodGetters(["valsArr"]),
    editDialogText() {
      let text = "";
      if (this.selType === "many") {
        return (text = "动态参数");
      } else {
        return (text = "静态属性");
      }
    }
  },
  filters: {}
};
</script>

<style scoped lang='scss'>
</style>