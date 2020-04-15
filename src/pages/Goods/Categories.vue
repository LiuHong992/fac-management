<template>
  <div class="categories-wrapper">
    <el-card>
      <!-- 头部的添加分类按钮 -->
      <div class="btn m-b-20">
        <el-button type="primary" @click="addCategory">添加分类</el-button>
      </div>
      <!-- 表格 -->
      <cTable @editCategorys="editCategorys"></cTable>
      <!-- 编辑dialog -->
      <el-dialog title="编辑分类" :show-close="false" :visible.sync="editFlag" width="35%">
        <el-form
          :model="editCategory"
          :rules="rules"
          ref="editForm"
          label-position="right"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editCategory.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel('editForm')">取 消</el-button>
          <el-button type="primary" @click="confirm('editForm')">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加dialog -->
      <el-dialog title="添加分类" :show-close="false" :visible.sync="addFlag" width="35%">
        <el-form
          :model="addObj"
          :rules="rules"
          ref="addForm"
          label-position="right"
          label-width="100px"
        >
          <!-- 分类名称 -->
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addObj.cat_name"></el-input>
          </el-form-item>
          <!-- 级联选择器 -->
          <el-form-item label="父级分类" prop="cat_id">
            <el-cascader
              :disabled="cascaderFlag"
              :options="classfyArr"
              :props="{ checkStrictly: true,value:'cat_id',label:'cat_name' }"
              clearable
              @change="handleChange"
              style="width:100%"
            ></el-cascader>
          </el-form-item>
          <!-- 父级分类框 -->
        </el-form>
        <!-- 底部 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel('addForm')">取 消</el-button>
          <el-button type="primary" @click="confirm('addForm')">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import cTable from "../../components/Goods/CategoriesTable";
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
      // 编辑分类框的状态
      editFlag: false,
      // 编辑框验证规则
      rules: {
        cat_name: [
          { required: true, message: "分类名称不能为空", trigger: "blur" },
          { min: 2, max: 10, message: "分类名称在2-10位之间", trigger: "blur" }
        ]
      },
      // 添加框状态
      addFlag: false,
      // 添加框的内容
      addObj: {
        cat_pid: 0,
        cat_name: "",
        cat_level: 0
      }
      // 级联器状态
    };
  },
  components: {
    cTable
  },
  methods: {
    ...goodActions([
      "getClassfies",
      "changeCategory",
      "getClassfies",
      "addCategories"
    ]),
    // 子组件分发回父组件打开编辑dialog的方法
    editCategorys(flag, num, size) {
      this.editFlag = flag;
      this.pagenum = num;
      this.pagesize = size;
    },
    // 取消(添加)按钮
    cancel(formName) {
      this.editFlag = false;
      this.addFlag = false;
      this.$refs[formName].resetFields();
    },
    // 确定按钮
    confirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // if条件下为编辑框确定按钮触发 else条件下为添加框确定按钮触发
          if (formName === "editForm") {
            this.changeCategory({
              id: this.editCategory.cat_id,
              cat_name: this.editCategory.cat_name
            });
          } else {
            this.addCategories({
              cat_pid: this.addObj.cat_pid,
              cat_name: this.addObj.cat_name,
              cat_level: this.addObj.cat_level
            });
          }
          setTimeout(() => {
            this.editFlag = false;
            this.addFlag = false;
            this.getClassfies({
              pagenum: this.pagenum,
              pagesize: this.pagesize,
              type: 3
            });
            this.$refs[formName].resetFields();
          }, 200);
        } else {
          return false;
        }
      });
    },
    // 添加分类
    addCategory() {
      this.addFlag = true;
      // 点击添加分类还要发一个获取到一二级分类的请求
      this.getClassfies({ type: 2 });
    },
    // 级联选择器方法
    handleChange(value) {
      this.addObj.cat_pid = value[value.length - 1];
      this.addObj.cat_level = value.length;
      // console.log(this.addObj.cat_pid);
      // console.log(this.addObj.cat_level);
    }
  },
  mounted() {},
  watch: {},
  computed: {
    ...goodState(["editCategory", "classfyArr"]),
    cascaderFlag() {
      if (this.addObj.cat_name.trim() === "") {
        return true;
      } else {
        return false;
      }
    }
  },
  filters: {}
};
</script>

<style scoped lang='scss'>
</style>