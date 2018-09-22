<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="index-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="rightList" stripe style="width: 100%">
      <el-table-column type="index" width="50" align="left">
      </el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180" align="left">
      </el-table-column>
      <el-table-column prop="path" label="路径" width="180" align="left">
      </el-table-column>
      <el-table-column prop="level" label="层级" align="left">
        <template slot-scope="scope">
          <span v-if="scope.row.level==='0'">一级</span>
          <span v-else-if="scope.row.level==='1'">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightList: []
    }
  },
  created() {
    this.getRightList()
  },
  methods: {
    getRightList() {
      this.$axios.get('/rights/list').then(res => {
        console.log(res)
        const { data, meta } = res.data
        if (meta.status === 200) {
          this.rightList = data
        }
      })
    }
  }
}
</script>

<style>
.index-breadcrumb {
  line-height: 40px;
  background-color: #d4dae0;
  font-size: 16px;
  padding-left: 10px;
}
</style>
