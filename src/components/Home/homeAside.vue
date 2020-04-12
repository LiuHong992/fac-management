<template>
  <div class="el-aside-content">
    <el-menu
      :default-active="defaultAddress"
      class="el-menu"
      @open="handleOpen"
      @close="handleClose"
      :unique-opened="true"
      :router="true"
      @select="handleSelect"
    >
      <el-menu-item index="/">
        <template slot="title">
          <i class="el-icon-s-home"></i>
          <span>首页</span>
        </template>
      </el-menu-item>
      <el-submenu :index="`/${item.path}`" v-for="(item,index) in rightsList" :key="index">
        <template slot="title">
          <i :class="`el-icon-${item.faicon}`"></i>
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item
          :index="`/${item.path}/${item0.path}`"
          v-for="(item0,index0) in item.children"
          :key="index0"
        >
          <i :class="`el-icon-${item0.chilicon}`"></i>
          <span>{{item0.authName}}</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const homeMudule = createNamespacedHelpers("Home");
const { mapState: homeState, mapMutations: homeMutations } = homeMudule;
export default {
  data() {
    return {
      // 默认选中地址
      defaultAddress: ""
      // 接收缓存中的标签数组
      // tabList: []
    };
  },
  props: {
    rightsList: {
      type: Array,
      default: () => []
    }
  },
  components: {},
  methods: {
    ...homeMutations(["setTabList"]),
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    // 菜单点击之后的回调
    handleSelect(key, keyPath) {
      let authName = "";
      if (key !== "/") {
        this.rightsList.map(item => {
          item.children.map(item0 => {
            if (key === `/${item.path}/${item0.path}`) {
              authName = item0.authName;
            }
          });
        });
      } else {
        authName = "首页";
      }
      let obj = {
        name: authName,
        url: key
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
      }
      setTimeout(() => {
        localStorage.setItem("tabList", JSON.stringify(this.tabList));
      }, 50);
    }
  },
  mounted() {
    if (this.$route.path) {
      this.defaultAddress = this.$route.path;
    }
    if (localStorage.getItem("tabList")) {
      this.setTabList(JSON.parse(localStorage.getItem("tabList")));
    }
  },
  watch: {
    "$route.path"(val) {
      this.defaultAddress = val;
    }
  },
  computed: {
    ...homeState(["tabList"])
  },
  filters: {}
};
</script>

<style scoped lang='scss'>
.el-aside-content {
  height: 100%;
  overflow: auto;
}
</style>