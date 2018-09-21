<template>
  <div>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        <el-breadcrumb-item>活动列表</el-breadcrumb-item>
        <el-breadcrumb-item>活动详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row :gutter="20">
      <el-col :span="8">
        <div style="margin-top: 15px;">
          <el-input placeholder="请输入内容" v-model="searchinput" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>

          </el-input>

        </div>
      </el-col>
      <el-col :span="4" class="btn-success">
        <el-button type="success" plain>成功按钮</el-button>
      </el-col>
    </el-row>
    <el-row>

      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column align="left" prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column align="left" prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column align="left" prop="mobile" label="电话">
        </el-table-column>
        <el-table-column align="left" prop="mg_state" label="用户状态">
          <!-- 这是开关禁用状态 -->
          <template>
            <el-switch v-model="value2" active-color="#13ce66" inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="" label="操作">
        </el-table-column>
      </el-table>
    </el-row>
    <el-row justify="start">
      <el-col :span="8" align="left">
        <el-pagination :current-page.sync="curPage" :page-size="pageSize" background layout="prev, pager, next" :total="total" @current-change="changePage">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  created() {
    this.getdata()
  },
  methods: {
    getdata(curPage = 1) {
      this.$axios
        .get('/users', {
          params: {
            pagenum: curPage,
            pagesize: 2
          }
          // 这是将token作为请求头传递给后台
          // headers: {
          //   Authorization: localStorage.getItem('token')
          // }
        })
        .then(res => {
          const { data, meta } = res.data
          if (meta.status === 200) {
            console.log(data)
            this.total = data.total
            this.tableData = data.users
          }
        })
    },
    changePage(curPage) {
      this.getdata(curPage)
    }
  },
  data() {
    return {
      total: 0,
      searchinput: '',
      pageSize: 2,
      curPage: 1,
      tableData: [],
      value1: true,
      value2: true
    }
  }
}
</script>

<style>
.btn-success {
  padding-top: 15px;
}
</style>
