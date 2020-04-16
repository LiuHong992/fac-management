<template>
  <div class="tag-router-container" v-if="tabList.length>0">
    <div class="tags fl" v-if="tabList.length>1 || (tabList.length === 1 && tabList[0].url!=='/')">
      <draggable class="fl" v-model="tabLists" @end="endEvent" v-bind="dragOptions">
        <div
          class="tag-item a-c f-s-12 fl p-r"
          :class="activeUrl===item.url?'active':''"
          @contextmenu.prevent="show($event,index)"
          v-for="(item,index) in tabList"
          :key="index"
          @click="changeRouter(item.url)"
        >
          <div class="circle" v-if="activeUrl===item.url"></div>
          <div class="item">{{item.name}}</div>
          <div
            class="close p-a f-s-12 z-99"
            v-if="activeUrl===item.url"
            @click.stop="deleteRouter(index)"
          >
            <i class="el-icon-close"></i>
          </div>
        </div>
      </draggable>
    </div>
    <div class="tags fl" v-else>
      <div
        class="tag-item a-c f-s-12 fl p-r"
        @contextmenu.prevent="show($event,0)"
        :class="activeUrl==='/'?'active':''"
      >
        <div class="circle"></div>
        <div class="item">{{tabList[0].name}}</div>
      </div>
    </div>
    <!-- 右键事件菜单 -->
    <div class="menus p-a z-max f-s-12 p-5" :style="{left:left+'px',top:top+'px'}" v-if="menuFlag">
      <div @click="closeOther">关闭其他</div>
      <div @click="closeSide('left')">关闭左侧</div>
      <div @click="closeSide('right')">关闭右侧</div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const homeMudule = createNamespacedHelpers("Home");
const { mapState: homeState, mapMutations: homeMutations } = homeMudule;
import draggable from "vuedraggable";
export default {
  data() {
    return {
      // 接收缓存中的标签数组
      // tabList: [],
      // 当前路由路径
      activeUrl: "",
      dragOptions: { filter: ".disabled" },
      // 鼠标右键菜单框的状态
      menuFlag: false,
      // 菜单位置参数
      left: 0,
      top: 0,
      // 删除位置
      delIndex: -1
    };
  },
  components: {
    draggable
  },
  methods: {
    ...homeMutations(["setTabList"]),
    // 点击标签跳转路由
    changeRouter(paths) {
      this.$router.push(paths);
    },
    // 删除缓存中的地址
    deleteRouter(idx) {
      let delItem = this.tabList.splice(idx, 1)[0];
      let item = this.tabList[idx] ? this.tabList[idx] : this.tabList[idx - 1];
      if (item) {
        delItem.url === this.$route.path && this.$router.push(item.url);
      } else {
        let tabLists = [{ name: "首页", url: "/" }];
        this.setTabList(tabLists);
        localStorage.setItem("tabList", JSON.stringify(tabLists));
        this.$router.push("/");
      }
      localStorage.setItem("tabList", JSON.stringify(this.tabList));
    },
    // 拖拽结束
    endEvent() {
      localStorage.setItem("tabList", JSON.stringify(this.tabList));
    },
    // 鼠标右键单击事件
    show(e, idx) {
      this.left = e.x;
      this.top = e.y;
      if (idx > -1) {
        this.delIndex = idx;
      }
      this.menuFlag = true;
    },
    // 右键菜单关闭
    closeMenu() {
      this.menuFlag = false;
    },
    // 关闭其他
    closeOther() {
      let tArr = [];
      tArr = this.tabList.filter((item, index) => {
        return index === this.delIndex;
      });
      this.setTabList(tArr);
      this.activeUrl = tArr[0].url;
      setTimeout(() => {
        this.$router.push(tArr[0].url);
        localStorage.setItem("tabList", JSON.stringify(this.tabList));
      }, 200);
    },
    // 关闭左(右)侧
    closeSide(sideType) {
      let tArr = [];
      if (sideType === "left") {
        if (this.delIndex > 0) {
          tArr = this.tabList.slice(this.delIndex, this.tabList.length + 1);
          this.setTabList(tArr);
          this.activeUrl = tArr[0].url;
          setTimeout(() => {
            this.$router.push(tArr[0].url);
            localStorage.setItem("tabList", JSON.stringify(this.tabList));
          }, 200);
        } else {
          this.$message.error("已经是第一个了");
        }
      } else {
        if (this.delIndex < this.tabList.length - 1) {
          tArr = this.tabList.slice(0, this.delIndex + 1);
          this.setTabList(tArr);
          this.activeUrl = tArr[tArr.length - 1].url;
          setTimeout(() => {
            this.$router.push(tArr[tArr.length - 1].url);
            localStorage.setItem("tabList", JSON.stringify(this.tabList));
          }, 200);
        } else {
          this.$message.error("已经是最后一个了");
        }
      }
    }
  },
  mounted() {
    if (localStorage.getItem("tabList")) {
      this.setTabList(JSON.parse(localStorage.getItem("tabList")));
    }
    if (this.$route.path) {
      this.activeUrl = this.$route.path;
    }
  },
  watch: {
    "$route.path"() {
      this.activeUrl = this.$route.path;
      setTimeout(() => {
        this.setTabList(JSON.parse(localStorage.getItem("tabList")));
      }, 50);
    },
    // 菜单框的状态
    menuFlag(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    }
  },
  computed: {
    ...homeState(["tabList"]),
    tabLists: {
      get() {
        return this.tabList;
      },
      set(value) {
        this.setTabList(value);
      }
    }
  },
  filters: {}
};
</script>

<style scoped lang='scss'>
.tag-router-container {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  .tags {
    .active {
      background: #409eff;
      color: #fff;
    }
    .tag-item {
      border: 1px solid #ddd;
      padding: 2px 10px;
      margin-right: 5px;
      cursor: pointer;
      .circle {
        width: 8px;
        height: 8px;
        margin-right: 5px;
        border-radius: 50%;
        background-color: #fff;
      }
      .item {
        padding-right: 10px;
      }
      .close {
        top: 3px;
        right: 4px;
        padding-right: 2px;
      }
    }
  }
  // 右键菜单
  .menus {
    top: 94px;
    left: 343px;
    cursor: pointer;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    background-color: #fff;
    border-radius: 4px;
    div {
      padding: 7px 5px;
      z-index: 9999;
    }
  }
}
</style>