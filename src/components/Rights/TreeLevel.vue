<template>
  <div class="treelevel-wrapper">
    <div class="treelevel-content" v-if="treeArr.length>0">
      <!-- 模板 -->
      <div class="level fl a-c" v-for="(item,index) in treeArr" :key="index">
        <!-- 一级权限 -->
        <div class="level-one f-1 a-c">
          <el-tag closable @close="closeTag(item)">{{item.authName}}</el-tag>
          <span class="m-l-10">
            <i class="el-icon-caret-right"></i>
          </span>
        </div>
        <!-- 二级权限 -->
        <div class="level-two">
          <div class="two-tag fl a-c" v-for="(item0,index0) in item.children" :key="index0">
            <!-- 二级权限标题头 -->
            <el-tag closable type="success" @close="closeTag(item0)">{{item0.authName}}</el-tag>
            <span class="m-l-10">
              <i class="el-icon-caret-right"></i>
            </span>
            <!-- 三级权限 -->
            <div class="level-two level-three fl fl-w a-c">
              <div class="three-tag" v-for="(item1,index1) in item0.children" :key="index1">
                <el-tag
                  @close="closeTag(item1)"
                  class="m-l-20"
                  closable
                  type="warning"
                >{{item1.authName}}</el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 没有权限时展示 -->
    <div class="no-rights-content t-center h-40 l-h-40" v-else>暂无权限</div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const rightsModule = createNamespacedHelpers("Rights");
const {
  mapState: rightState,
  mapActions: rightActions,
  mapMutations: rightMutations
} = rightsModule;
export default {
  data() {
    return {};
  },
  props: {
    treeArr: {
      type: Array,
      default: () => []
    }
  },
  components: {},
  methods: {
    ...rightActions(["delOneRight"]),
    // 删除权限
    closeTag(tag) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delOneRight({
            roleId: this.editObj.id,
            rightId: tag.id
          });
          // this.treeArr = this.editRightsArr
          // this.$emit('closeTag',this.editRightsArr)
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消了删除"
          });
        });
    }
  },
  mounted() {},
  watch: {},
  computed: {
    ...rightState(["editRightsArr", "editObj"])
  },
  filters: {}
};
</script>

<style scoped lang='scss'>
.treelevel-wrapper {
  .treelevel-content {
    .level {
      border-top: 1px solid #eee;
      &:last-child {
        border-bottom: 1px solid #eee;
      }
      .level-one {
        padding: 10px 0;
        margin: 2px 0;
      }
      .level-two {
        flex: 4;
        .two-tag {
          margin: 5px 0;
          padding: 12px 0;
          .level-three {
            margin-left: 60px;
            .three-tag {
              margin: 10px 0;
            }
          }
        }
      }
    }
  }
}
</style>