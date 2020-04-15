<template>
  <div>
    <el-card>
      <!-- 顶部的添加角色按钮 -->
      <div class="btn m-b-20">
        <el-button type="primary" @click="addDialog = true">添加角色</el-button>
      </div>
      <!-- 表格内容层 -->
      <div class="table">
        <el-table :data="rolesArr" border stripe style="width: 100%" @expand-change="shwoRights">
          <!-- 扩展行 -->
          <el-table-column type="expand" width="50">
            <template slot-scope="scope">
              <tree-level :treeArr="scope.row.children"></tree-level>
            </template>
          </el-table-column>
          <!-- 编号 -->
          <el-table-column align="center" prop="index" label="#" width="50">
            <template slot-scope="scope">
              <span>{{ scope.$index+1}}</span>
            </template>
          </el-table-column>
          <!-- 职位 -->
          <el-table-column align="center" prop="roleName" label="职位" width="375">
            <template slot-scope="scope">
              <span>{{ scope.row.roleName}}</span>
            </template>
          </el-table-column>
          <!-- 描述 -->
          <el-table-column align="center" prop="roleDesc" label="描述" width="375">
            <template slot-scope="scope">
              <span>{{ scope.row.roleDesc}}</span>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作" width="350" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="editInfo(scope.row)">编辑</el-button>
              <el-button type="danger" size="mini" @click="delInfo(scope.row)">删除</el-button>
              <el-button type="warning" size="mini" @click="alloRole(scope.row)">分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加用户dialog -->
      <el-dialog title="添加用户" :show-close="false" :visible.sync="addDialog" width="30%">
        <el-form
          :model="addObj"
          :rules="rules"
          ref="ruleForm"
          label-position="right"
          label-width="100px"
        >
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="addObj.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addObj.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel('ruleForm')">取 消</el-button>
          <el-button type="primary" @click="addconfirm('ruleForm')">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑用户dialog -->
      <el-dialog title="编辑用户" :show-close="false" :visible.sync="editDialog" width="30%">
        <el-form
          :model="editObj"
          :rules="rules"
          ref="ruleForm"
          label-position="right"
          label-width="100px"
        >
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="editObj.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editObj.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel('ruleForm')">取 消</el-button>
          <el-button type="primary" @click="editconfirm('ruleForm')">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配权限dialog -->
      <el-dialog title="分配权限" :show-close="false" :visible.sync="alloDialog" width="50%">
        <el-tree
          :data="treeRights"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="nowIdArr"
          :props="defaultProps"
          ref="tree"
          @check-change="handleCheckChange"
        ></el-tree>
        <!-- 底部 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel()">取 消</el-button>
          <el-button type="primary" @click="alloconfirm">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const rightsModule = createNamespacedHelpers("Rights");
const {
  mapState: rightState,
  mapActions: rightActions,
  mapMutations: rightMutations,
  mapGetters: rightGetters
} = rightsModule;
import treeLevel from "../../components/Rights/TreeLevel";
export default {
  data() {
    return {
      // 本页面表单验证规则
      rules: {
        roleName: [
          { required: true, message: "角色名不能为空", trigger: "blur" },
          { min: 2, max: 8, message: "长度在2到8个字符", trigger: "blur" }
        ]
      },
      // 编辑框的状态
      editDialog: false,
      // 添加框的状态
      addDialog: false,
      // 分配权限框的状态
      alloDialog: false,
      // 添加的角色信息
      addObj: {
        // 角色名
        roleName: "",
        // 角色描述(可以为空)
        roleDesc: ""
      },
      defaultProps: {
        children: "children",
        label: "authName"
      },
      // 当前用户修改后的权限列表
      distributionList: []
    };
  },
  components: {
    treeLevel
  },
  methods: {
    ...rightActions([
      "getAllRight",
      "getAllRoles",
      "delRole",
      "addRoles",
      "editRoles",
      "alloRights",
      "getById"
      // 'getOneRole'
    ]),
    ...rightMutations(["setEditRightsArr", "setEditObj"]),
    // 表格展开行触发的方法
    shwoRights(row) {
      this.setEditObj(row);
      this.setEditRightsArr(row.children);
    },
    // 编辑框关闭的回调
    // closeItem(formName) {
    //   this.$refs[formName].resetFields();
    // },
    // 打开编辑框
    editInfo(info) {
      this.editDialog = true;
      this.getById(info.id);
    },
    // 删除dilog打开
    delInfo(info) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delRole(info.id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消了删除"
          });
        });
    },
    // 分配权限框打开
    alloRole(infos) {
      this.alloDialog = true;
      this.getAllRight("tree");
      this.setEditObj(infos);
      this.setEditRightsArr(infos.children);
    },
    // 取消(添加)按钮
    cancel(formName) {
      this.editDialog = false;
      this.addDialog = false;
      this.alloDialog = false;
      if (formName) {
        this.$refs[formName].resetFields();
      }
    },
    // 新增角色确定按钮
    addconfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addDialog = false;
          this.addRoles(this.addObj);
          setTimeout(() => {
            this.$refs[formName].resetFields();
          }, 200);
        } else {
          return false;
        }
      });
    },
    // 编辑角色确定按钮
    editconfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.editDialog = false;
          this.editRoles({
            id: this.editObj.id,
            roleName: this.editObj.roleName,
            roleDesc: this.editObj.roleDesc
          });
        } else {
          return false;
        }
      });
    },
    // 树形控件选中状态修改后触发的方法
    handleCheckChange() {
      let res = this.$refs.tree
        .getCheckedNodes()
        .concat(this.$refs.tree.getHalfCheckedNodes());
      let arr = [];
      res.forEach(item => {
        arr.push(item.id);
      });
      this.distributionList = arr;
      // console.log(this.distributionList);
    },
    // 分配权限dialog确定按钮
    alloconfirm() {
      let rightsId = this.distributionList.toString();
      this.alloRights({
        roleId: this.editObj.id,
        rids: rightsId
      });
      this.alloDialog = false;
    },
    // 子组件分发回父组件的方法
    // closeTag(data, oldVal) {
    //   console.log(data);
    //   console.log(oldVal);
    //   oldVal = data;
    // }
  },
  mounted() {
    this.getAllRoles();
    this.getAllRight("list");
  },
  watch: {},
  computed: {
    ...rightState(["rolesArr", "treeRights", "editRightsArr", "editObj"]),
    ...rightGetters(["rightsIdArr", "nowIdArr"])
  },
  filters: {}
};
</script>

<style scoped lang='scss'>
</style>