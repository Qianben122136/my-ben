<template>
  <div>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="index-breadcrumb">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row :gutter="20">
      <el-col :span="8">
        <div style="margin-top: 15px;">
          <el-input placeholder="请输入用户名" v-model="searchinput" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click='searchbtn'></el-button>
          </el-input>

        </div>
      </el-col>
      <el-col :span="4" class="btn-success">
        <el-button type="success" plain @click='userAdd'>添加用户</el-button>
      </el-col>
    </el-row>
    <el-row>

      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column align="left" prop="username" label="姓名" width='150'>
        </el-table-column>
        <el-table-column align="left" prop="email" label="邮箱" width='160'>
        </el-table-column>
        <el-table-column align="left" prop="mobile" label="电话" width='160'>
        </el-table-column>
        <el-table-column align="left" prop="mg_state" label="用户状态" width='150'>
          <!-- 这是开关禁用状态 -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStatu(scope.row.id,scope.row.mg_state)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" plain icon="el-icon-edit" size='mini' @click='editFormById(scope.row.id)'></el-button>
            <el-button type="danger" plain icon="el-icon-delete" size='mini' @click="delUserList(scope.row.id)"></el-button>
            <el-button type="success" size='mini' plain>分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!-- 分页插件 -->
    <el-row justify="start">
      <el-col :span="8" align="left">
        <el-pagination :current-page.sync="curPage" :page-size="pageSize" background layout="prev, pager, next" :total="total" @current-change="changePage">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 这是添加用户弹出的模态框 -->
    <el-dialog align='left' title="添加用户" :visible.sync="addUserDialog" width='50%' @close='closeUserDialog'>
      <el-form :model="addForm" :rules="rules" ref="addForm">
        <el-form-item label="用户名" prop='username' label-width="90px">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="90px" prop='password'>
          <el-input v-model="addForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="90px" prop='email'>
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" label-width="90px" prop='mobile'>
          <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户信息的模态框 -->
    <el-dialog align='left' title="编辑用户" :visible.sync="editUserDialog" width='50%' @close='closeEditDialog'>
      <el-form :model="editForm" :rules="editRules" ref="editForm">
        <el-form-item label="用户名" prop='username' label-width="90px">
          <el-input v-model="editForm.username" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" label-width="90px" prop='mobile'>
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="90px" prop='email'>
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="editSubmitForm('editForm')">确 定</el-button>
      </div>
    </el-dialog>

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
            query: this.searchinput,
            pagenum: curPage,
            pagesize: this.pageSize
          }
          // 这是将token作为请求头传递给后台
          // headers: {
          //   Authorization: localStorage.getItem('token')
          // }
        })
        .then(res => {
          const { data, meta } = res.data
          if (meta.status === 200) {
            this.total = data.total
            this.tableData = data.users
          }
        })
    },
    changePage(curPage) {
      this.getdata(curPage)
    },
    userStatu(id, mgstate) {
      this.$axios.put(`/users/${id}/state/${mgstate}`).then(res => {
        const { data, meta } = res.data
        if (meta.status === 200) {
          this.$message({
            type: 'success',
            message: data.mg_state === 0 ? '状态禁用成功' : '状态开启成功',
            duration: 1000
          })
        } else {
          this.$message({
            type: 'error',
            message: meta.msg,
            duration: 1000
          })
        }
      })
    },
    userAdd() {
      this.addUserDialog = true
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios.post('/users', this.addForm).then(res => {
            const { meta } = res.data
            if (meta.status === 201) {
              // 关闭模态框
              this.addUserDialog = false
              // 更新列表看能不能跳回到最后一夜
              this.curPage = 1
              this.getdata()
            }
          })
        } else {
          return false
        }
      })
    },
    editSubmitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const { id, email, mobile } = this.editForm
          this.$axios
            .put(`/users/${id}`, {
              email,
              mobile
            })
            .then(res => {
              const { data, meta } = res.data
              if (meta.status === 200) {
                this.editUserDialog = false
                // 这里要更新刚刚更改的数据
                const editItem = this.tableData.find(item => item.id === id)
                editItem.email = data.email
                editItem.mobile = data.mobile
              }
            })
        } else {
          return false
        }
      })
    },
    closeUserDialog() {
      this.$refs.addForm.resetFields()
    },
    closeEditDialog() {
      this.$refs.editForm.resetFields()
    },
    searchbtn() {
      this.getdata()
    },
    editFormById(id) {
      this.editUserDialog = true
      this.$axios.get(`users/${id}`).then(res => {
        const { data, meta } = res.data
        if (meta.status === 200) {
          this.editForm = {
            id: data.id,
            username: data.username,
            email: data.email,
            mobile: data.mobile
          }
        }
      })
    },
    delUserList(id) {
      this.$confirm('此操作将删除该该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios.delete(`users/${id}`).then(res => {
            if (res.data.meta.status === 200) {
              // 删除之后 需要删除掉对应列表的数据
              const index = this.tableData.findIndex(item => item.id === id)

              this.tableData.splice(index, 1)

              const totalPage = Math.ceil(this.tableData.length / this.pageSize)

              if (this.curPage > totalPage) {
                this.getdata(--this.curPage)
              }
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  data() {
    return {
      total: 0,
      searchinput: '',
      pageSize: 3,
      curPage: 1,
      tableData: [],
      addUserDialog: false,
      editUserDialog: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        id: -1,
        username: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '请输入正确的手机格式',
            trigger: 'blur'
          }
        ]
      },
      editRules: {
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '请输入正确的手机格式',
            trigger: 'change'
          }
        ]
      }
    }
  }
}
</script>

<style>
.btn-success {
  padding-top: 15px;
}
.index-breadcrumb {
  line-height: 40px;
  background-color: #d4dae0;
  font-size: 16px;
  padding-left: 10px;
}
</style>
