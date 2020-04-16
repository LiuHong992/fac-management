<template>
  <div class="content">
    <div>
      <mavon-editor v-model="goods_introduce" />
    </div>
    <!-- 提交按钮 -->
    <div class="btn">
      <el-button type="success" size="mini" @click="submit">提交</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goods_introduce: ""
    };
  },
  components: {},
  methods: {
    submit() {
      this.$emit("submit", this.goods_introduce);
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