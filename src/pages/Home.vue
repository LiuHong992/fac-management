<template>
  <div class="main-container">
    <el-container>
      <el-header>
        <div class="headerNav z-99 fl s-b a-c f-center">
          <!-- 左边的欢迎词 -->
          <div class="nav-left">欢迎来到凌风后台系统</div>
          <!-- 右边的相关功能 -->
          <div class="nav-right fl a-c f-center">
            <!-- 当前时间 -->
            <div class="rightnow">{{timeNow}}</div>
            <!-- 获取天气情况 -->
            <div class="weather fl a-c f-center">
              <div class="w-img fl a-c f-center">
                <img :src="weatherPic" />
              </div>
              <!-- 天气状况 -->
              <div class="w-txt">{{weatherInfo}}</div>
            </div>
            <!-- 用户 -->
            <div class="users fl a-c f-center">
              <div class="wel">亲爱的</div>
              <div class="uname">{{userInfo.username}}</div>
            </div>
            <!-- 退出系统 -->
            <div class="loginout">退出</div>
          </div>
        </div>
      </el-header>
      <el-container class="el-container-wrapper">
        <el-aside width="200px" class="el-aside-container">
          <homeAside :rightsList="getNewRightsList"></homeAside>
        </el-aside>
        <el-main class="el-main-container">
          <!-- 标签栏(可跳转路由) -->
          <div class="tag-router-wrapper">
            <commonTag></commonTag>
          </div>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const homeMudule = createNamespacedHelpers("Home");
const goodsModule = createNamespacedHelpers("Goods");
const {
  mapState: homeState,
  mapActions: homeActions,
  mapGetters: homeGetters,
  mapMutations: homeMutations
} = homeMudule;
const { mapMutations: goodMutations } = goodsModule;
import config from "../config/index";
import homeAside from "../components/Home/homeAside";
import commonTag from "../components/Home/commonTag";
export default {
  name: "",
  props: {},
  components: {
    homeAside,
    commonTag
  },
  data() {
    return {
      // 当前时间
      timeNow: null,
      // 定时器
      timer: null,
      // 天气状况
      weatherInfo: "",
      // 天气图片
      weatherPic: "",
      // 用户名
      userInfo: {},
      // 图标数组
      iconArr: [
        {
          faicon: "user",
          children: [
            {
              chilicon: "folder-opened"
            }
          ]
        },
        {
          faicon: "folder",
          children: [
            {
              chilicon: "setting"
            },
            {
              chilicon: "c-scale-to-original"
            }
          ]
        },
        {
          faicon: "shopping-bag-2",
          children: [
            {
              chilicon: "bangzhu"
            },
            {
              chilicon: "bell"
            },
            {
              chilicon: "date"
            }
          ]
        },
        {
          faicon: "s-order",
          children: [
            {
              chilicon: "folder-add"
            }
          ]
        },
        {
          faicon: "message",
          children: [
            {
              chilicon: "position"
            }
          ]
        }
      ]
    };
  },
  methods: {
    ...homeActions(["getAllMenu"]),
    ...goodMutations(["setParamsArr"]),
    // 请求天气
    getWeather() {
      let nowHour = new Date().getHours();
      this.$axios
        .get(
          `${config.Wsrc}?version=v6&appid=${config.WappId}&appsecret=${config.Wappsecret}`
        )
        .then(res => {
          if (res.data.wea_img === "yun") {
            res.data.wea_img = "duoyun";
          } else if (res.data.wea_img === "yu") {
            res.data.wea_img = "zhongyu";
          }
          if (nowHour >= 18 || nowHour < 6) {
            this.weatherPic = `http://api.map.baidu.com/images/weather/night/${res.data.wea_img}.png`;
          } else {
            this.weatherPic = `http://api.map.baidu.com/images/weather/day/${res.data.wea_img}.png`;
          }
          this.weatherInfo = res.data.wea;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    // 开启一个定时器
    this.timer = setInterval(() => {
      let now = this.$dayjs(Date.now()).format("HH");
      if (now >= 12) {
        this.timeNow = this.$dayjs(Date.now()).format(
          "YYYY/MM/DD 下午hh:mm:ss"
        );
      } else {
        this.timeNow = this.$dayjs(Date.now()).format(
          "YYYY/MM/DD 上午hh:mm:ss"
        );
      }
    }, 1000);
    this.getAllMenu();
    this.getWeather();
    // 获取存储在缓存中的用户信息
    if (localStorage.getItem("userData")) {
      this.userInfo = JSON.parse(localStorage.getItem("userData"));
    }
    if (!localStorage.getItem("tabList")) {
      let tabList = [{ name: "首页", url: "/" }];
      localStorage.setItem("tabList", JSON.stringify(tabList));
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  watch: {
    // 商品管理中的分类参数数组清空操作
    "$route.path"(path) {
      if (path !== "/goods/params") {
        this.setParamsArr([]);
      }
    }
  },
  computed: {
    ...homeState(["rightsList"]),
    ...homeGetters(["getNewRightsList"])
  },
  filters: {}
};
</script>

<style scoped lang='scss'>
.main-container {
  .headerNav {
    position: fixed;
    top: 0;
    width: 100%;
    background-color: #fff;
    border-bottom: 1px solid #f0f2f5;
    .nav-left {
      margin-left: 30px;
    }
    .nav-right {
      height: 100%;
      margin-right: 50px;
      .weather {
        margin: 0 20px;
        .w-img {
          height: 60px;
          margin-right: 8px;
          img {
            height: 25px;
            width: 38px;
          }
        }
      }
      .loginout {
        margin-left: 12px;
        color: skyblue;
      }
    }
  }
  .el-container-wrapper {
    padding: 0 20px;
    .el-aside-container {
      height: 100vh;
      overflow: auto;
    }
    .el-main-container {
      height: 100vh;
      overflow: auto;
    }
  }
}
</style>