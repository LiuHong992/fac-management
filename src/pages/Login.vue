<template>
  <div class="login-wrapper fl a-c f-center">
    <!-- 表单层 -->
    <div class="form">
      <el-card>
        <div slot="header">
          <h1 class="t-center">欢迎来到凌风后台管理系统</h1>
        </div>
        <!-- 表单 -->
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="ruleForm.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <!-- 特别提醒 -->
          <div class="notice">特别提醒: 如果您是管理员,请使用管理员账号登录,如果不知道账号,请联系公司人事。</div>
          <el-form-item class="login-btn">
            <div class="btn fl a-c f-center">
              <el-button type="primary" :loading="loadingFlag" @click="submitForm('ruleForm')">立即登录</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const userModule = createNamespacedHelpers("User");
const { mapState: userState, mapActions: userActions } = userModule;
export default {
  name: "",
  props: {},
  components: {},
  data() {
    return {
      // 加载状态
      loadingFlag: false,
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码最少为6位", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    ...userActions(["logins"]),
    // 登录
    submitForm(formName) {
      this.loadingFlag = true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          setTimeout(() => {
            this.loadingFlag = false;
            this.logins(this.ruleForm);
            setTimeout(() => {
              this.loadingFlag = false;
              this.resetForm("ruleForm");
            }, 50);
          }, 1000);
        } else {
          this.loadingFlag = false;
          this.resetForm("ruleForm");
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted() {},
  watch: {},
  computed: {}
};
</script>

<style scoped lang='scss'>
.login-wrapper {
  width: 100vw;
  height: 100vh;
  background: url("../assets/images/login-bg.jpg") no-repeat;
  background-size: 100% 100%;
  .form {
    .login-btn {
      margin-bottom: 22px;
      .btn {
        margin-top: 20px;
      }
    }
  }
}
</style>