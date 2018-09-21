<template>
  <div>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        <el-breadcrumb-item>活动列表</el-breadcrumb-item>
        <el-breadcrumb-item>活动详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row :gutter="20">
      <el-col :span="8">
        <div style="margin-top: 15px;">
          <el-input placeholder="请输入内容" v-model="input5" class="input-with-select">
            <el-select v-model="select" slot="prepend" placeholder="请选择">
              <el-option label="餐厅名" value="1"></el-option>
              <el-option label="订单号" value="2"></el-option>
              <el-option label="用户电话" value="3"></el-option>
            </el-select>
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
          <el-switch v-model="value2" active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
        </el-table-column>
        <el-table-column align="left" prop="" label="操作">
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  created() {
    this.getdata()
  },
  methods: {
    getdata() {
      axios
        .get('http://localhost:8888/api/private/v1/users', {
          params: {
            pagenum: 1,
            pagesize: 3
          },
          headers: {
            Authorization: localStorage.getItem('token')
          }
        })
        .then(res => {
          const { data, meta } = res.data
          if (meta.status === 200) {
            console.log(data)
            this.tableData = data.users
          }
        })
    }
  },
  data() {
    return {
      input3: '',
      input4: '',
      input5: '',
      select: '',
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
