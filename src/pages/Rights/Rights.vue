<template>
  <div>
    <el-card>
      <el-table :data="listRights" stripe border style="width: 100%">
        <el-table-column align="center" prop="index" label="#" width="100">
          <template slot-scope="scope">
            <span>{{ scope.$index+1}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="authName" label="权限名称" width="550">
          <template slot-scope="scope">
            <span>{{ scope.row.authName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="level" label="权限等级" width="550">
          <template slot-scope="scope">
            <!-- 等级标签 -->
            <el-tag v-if="scope.row.level==='0'">一级</el-tag>
            <el-tag v-if="scope.row.level==='1'" type="success">二级</el-tag>
            <el-tag v-if="scope.row.level==='2'" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const rightsModule = createNamespacedHelpers("Rights");
const { mapState: rightState, mapActions: rightActions } = rightsModule;
export default {
  data() {
    return {};
  },
  components: {},
  methods: {
    ...rightActions(["getAllRight"])
  },
  mounted() {
    this.getAllRight("list");
  },
  watch: {},
  computed: {
    ...rightState(["listRights"])
  },
  filters: {}
};
</script>

<style scoped lang='scss'>
</style>