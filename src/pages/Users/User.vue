<template>
  <div>
    <el-card>
      <div class="user-wrapper" v-if="usersArr.length>0">
        <!-- 顶部搜索框和添加按钮 -->
        <div class="top fl a-c m-b-20">
          <!-- 搜索框 -->
          <div class="search-wrapper m-r-20">
            <el-input placeholder="请输入搜索内容" v-model="uSearch">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>
          <!-- 添加用户按钮 -->
          <div class="btn">
            <el-button type="primary" @click="addDialog = true">添加用户</el-button>
          </div>
        </div>
        <!-- 表格内容 -->
        <div class="table">
          <!-- 表格内容 -->
          <el-table :data="usersArr" style="width: 100%" :border="true" stripe>
            <!-- 编号 -->
            <el-table-column label="#" width="100" align="center">
              <template slot-scope="scope">
                <span>{{ scope.$index+1}}</span>
              </template>
            </el-table-column>
            <!-- 姓名 -->
            <el-table-column label="姓名" width="200" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.username }}</span>
              </template>
            </el-table-column>
            <!-- 角色 -->
            <el-table-column label="角色" width="200" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.role_name }}</span>
              </template>
            </el-table-column>
            <!-- 电话 -->
            <el-table-column label="电话" width="200" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.mobile }}</span>
              </template>
            </el-table-column>
            <!-- 邮箱 -->
            <el-table-column label="邮箱" width="200" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.email }}</span>
              </template>
            </el-table-column>
            <!-- 状态 -->
            <el-table-column label="状态" width="100" align="center">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.mg_state"
                  :data-id="scope.row.id"
                  @change="changeState(scope.row)"
                  active-color="#409EFF"
                  inactive-color="#DCDFE6"
                ></el-switch>
              </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column label="操作" width="200" align="center">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="编辑角色" placement="top">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    @click="editInfo(scope.row)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除角色" placement="top">
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="delInfo(scope.row)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
                  <el-button
                    type="warning"
                    icon="el-icon-setting"
                    size="mini"
                    @click="alloRole(scope.row)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页组件 -->
          <pagination
            :pagenum="pagenum"
            :pagesize="pagesize"
            :maxpage="maxpage"
            :total="usersArr.length"
            @changeSize="changeSize"
            @changeNum="changeNum"
          ></pagination>
        </div>
      </div>
    </el-card>
    <!-- 添加用户框 -->
    <el-dialog title="添加用户" :show-close="false" :visible.sync="addDialog" width="40%">
      <!-- 中间的表单 -->
      <el-form
        :rules="rules"
        ref="ruleForm"
        label-position="right"
        label-width="100px"
        :model="addObj"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addObj.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addObj.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addObj.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addObj.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="addconfirm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 用户编辑框 -->
    <el-dialog title="编辑用户" :show-close="false" :visible.sync="editDialog" width="40%">
      <!-- 中间内容层 -->
      <el-form
        label-position="right"
        label-width="100px"
        :model="editObj"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editObj.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editObj.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editObj.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="confirm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 用户角色分配框 -->
    <el-dialog title="分配用户" :show-close="false" :visible.sync="alloDialog" width="40%">
      <!-- 当前用户 -->
      <div class="fl h-40 l-h-40">当前用户：{{editObj.username}}</div>
      <!-- 当前角色 -->
      <div class="fl h-40 l-h-40 m-t-5 m-b-5">当前角色：{{editObj.role_name}}</div>
      <!-- 角色选择器 -->
      <el-select v-model="selectRole" placeholder="请选择">
        <el-option
          v-for="(item,index) in rolesArr"
          :key="index"
          :label="item.roleName"
          :value="item.id"
        ></el-option>
      </el-select>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="roleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const userModule = createNamespacedHelpers("User");
const rightsModule = createNamespacedHelpers("Rights");
const {
  mapState: userState,
  mapActions: userActions,
  mapMutations: userMutations
} = userModule;
const { mapState: rightsState, mapActions: rightsActions } = rightsModule;
import pagination from "../../components/User/Pagination";
export default {
  data() {
    // 邮箱的表单验证
    var checkEmail = (rule, value, callback) => {
      var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if (!reg.test(value)) {
        callback(new Error("请输入正确的邮箱"));
      }
      callback();
    };
    // 手机号的表单验证
    var checkMobile = (rule, value, callback) => {
      var reg = /^1[3456789]\d{9}$/;
      if (!reg.test(value)) {
        callback(new Error("请输入正确的电话"));
      }
      callback();
    };
    return {
      // 当前页码
      pagenum: 1,
      // 当前每页最大数
      pagesize: 10,
      // 每页最大数数组
      maxpage: [5, 15, 20, 30],
      // 搜索框的值
      uSearch: "",
      // 编辑框的状态
      editDialog: false,
      // 编辑框表单验证规则
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { min: 2, max: 15, message: "长度在2到15个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 15, message: "长度在6到15个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "电话不能为空", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      // 添加框的状态
      addDialog: false,
      // 新增用户初始信息
      addObj: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 分配角色框的状态
      alloDialog: false,
      // 角色框选择器的值
      selectRole: ""
    };
  },
  components: {
    pagination
  },
  methods: {
    // 用户模块
    ...userActions([
      "getUsersList",
      "changeStates",
      "updateInfo",
      "delUser",
      "addUsers",
      "assignRole",
      "getById"
    ]),
    ...userMutations(["setUsersArr"]),
    // 权限模块
    ...rightsActions(["getAllRoles"]),
    // 更新数据的方法
    getUsers() {
      this.getUsersList({
        pagenum: this.pagenum,
        pagesize: this.pagesize,
        query: this.uSearch
      });
    },
    // 状态switch改变状态
    changeState(data) {
      this.changeStates({ uId: data.id, type: data.mg_state });
    },
    // 打开编辑框
    editInfo(info) {
      this.editDialog = true;
      this.getById(info.id);
    },
    // 取消(添加)按钮
    cancel(formNames) {
      this.editDialog = false;
      this.addDialog = false;
      this.alloDialog = false;
      if (formNames) {
        this.$refs[formNames].resetFields();
      }
    },
    // 编辑角色点击确定时触发的事件
    confirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.editDialog = false;
          this.updateInfo({
            id: this.editObj.id,
            email: this.editObj.email,
            mobile: this.editObj.mobile
          });
          setTimeout(() => {
            this.getUsers();
          }, 80);
        } else {
          return false;
        }
      });
    },
    // 新增角色确定按钮
    addconfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addDialog = false;
          this.addUsers(this.addObj);
          setTimeout(() => {
            this.getUsers();
            this.$refs[formName].resetFields();
          }, 200);
        } else {
          return false;
        }
      });
    },
    // 删除dilog打开
    delInfo(info) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delUser(info.id);
          setTimeout(() => {
            this.getUsers();
          }, 80);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消了删除"
          });
        });
    },
    // 分配角色框打开
    alloRole(infos) {
      this.alloDialog = true;
      this.setEditObj(infos);
    },
    // 分配角色确定按钮
    roleConfirm() {
      if (this.editObj.username === "admin") {
        this.$message.error("不允许修改admin账户");
      } else {
        if (this.selectRole !== "") {
          this.alloDialog = false;
          this.assignRole({ id: this.editObj.id, rid: this.selectRole });
          setTimeout(() => {
            this.selectRole = "";
            this.getUsers();
          }, 80);
        } else {
          this.$message.error("角色ID不能为空");
        }
      }
    },
    // 分页组件分发回父组件的改变最大页数的方法
    changeSize(e) {
      this.pagesize = e;
      setTimeout(() => {
        this.getUsers();
      }, 50);
    },
    // 分页组件分发回父组件的改变当前页数的方法
    changeNum(e) {
      this.pagenum = e;
      setTimeout(() => {
        this.getUsers();
      }, 50);
    }
  },
  mounted() {
    this.getUsers();
    this.getAllRoles();
  },
  watch: {},
  computed: {
    ...userState(["usersArr", "editObj"]),
    // 权限模块数据
    ...rightsState(["rolesArr"])
  },
  filters: {}
};
</script>

<style scoped lang='scss'>
.user-wrapper {
  .top {
    .search-wrapper {
      width: 30%;
    }
  }
}
</style>