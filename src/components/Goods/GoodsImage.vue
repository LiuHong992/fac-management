<template>
  <div class="content m-20">
    <el-upload
      class="upload-demo"
      drag
      action="http://49.233.170.124:8888/api/private/v1/"
      multiple
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
      <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <!-- 下一步按钮 -->
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
      let num = 4;
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