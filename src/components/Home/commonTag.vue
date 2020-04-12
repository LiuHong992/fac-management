<template>
  <div class="tag-router-container" v-if="tabList.length>0">
    <div class="tags fl" v-if="tabList.length>1 || (tabList.length === 1 && tabList[0].url!=='/')">
      <draggable
        class="fl"
        v-model="tabLists"
        @end="endEvent"
        v-bind="dragOptions"
      >
        <div
          class="tag-item a-c f-s-12 fl p-r"
          :class="activeUrl===item.url?'active':''"
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
      <div class="tag-item a-c f-s-12 fl" :class="activeUrl==='/'?'active':''">
        <div class="circle"></div>
        <div class="item">{{tabList[0].name}}</div>
      </div>
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

      dragOptions: { filter: ".disabled" }
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
}
</style>