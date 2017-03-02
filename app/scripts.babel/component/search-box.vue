<template>
  <el-row :gutter="20">
    <el-col :span="8">
      <el-input
              icon="search"
              :on-icon-click="filterData()"
              v-model="input" placeholder="请输入筛选条件"
      ></el-input>
    </el-col>
  </el-row>
</template>
<script>
  export default Vue.component('search-box', {
    data() {
      return {
        input: ''
      };
    },
    methods: {
      filterData() {
        this.$emit('filter', this.input);
      }
    }
  });
</script>
