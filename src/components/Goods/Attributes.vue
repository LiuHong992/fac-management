<template>
  <div>
    <!-- 属性内容层 -->
    <div class="attributes-wrapper f-s-14">暂无属性</div>
    <div class="btn">
      <el-button type="success" size="mini" @click="nextTo">下一步</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  components: {},
  methods: {
    // 下一步
    nextTo() {
      let num = 3;
      this.$emit("nextTo", num);
    }
  },
  mounted() {},
  watch: {},
  computed: {},
  filters: {}
};
</script>

<style scoped lang='scss'>
.btn {
  margin: 20px 30px;
}
</style>