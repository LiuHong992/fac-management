<template>
  <div class="m-t-20">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="maxpage"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // currentPage: 1
    };
  },
  props: {
    pagenum: {
      type: Number,
      default: 1
    },
    pagesize: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      default: 0
    },
    maxpage: {
      type: Array,
      default: () => []
    }
  },
  components: {},
  methods: {
    //   页数最大条数改变
    handleSizeChange(val) {
      this.$emit("changeSize", val);
    },
    //   当前页数
    handleCurrentChange(val) {
      this.$emit("changeNum", val);
    }
  },
  mounted() {},
  watch: {},
  computed: {},
  filters: {}
};
</script>

<style scoped lang='scss'>
</style>