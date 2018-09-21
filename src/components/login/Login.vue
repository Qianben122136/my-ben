<template>
  <div class="box">

    <el-row type="flex" class="row-bg" justify="center" align="middle">

      <el-col :xs="18" :sm="12" :md="9" :lg="8" :xl="8" class="login-out">
        <el-form :model="loginForm" label-position="top" :rules="rules" ref="loginForm" label-width="100px" class="loginForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item type="password" label="密码" prop="password">
            <el-input v-model="loginForm.password"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
            <el-button @click="resetForm('loginForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>

    </el-row>
  </div>

</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login() {
      this.$axios.post('/login', this.loginForm).then(res => {
        console.log(res)
        const { data, meta } = res.data
        if (meta.status === 200) {
          console.log('登录成功')
          // 这里吧toao存储到localstr里面
          localStorage.setItem('token', data.token)
          this.$router.push('/home')
        } else {
          this.$message({
            message: '密码错误',
            type: 'error'
          })
          console.log('登录失败')
        }
      })
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 成功之后做的是
          this.login()
          console.log(this.loginForm)
        } else {
          // 错误信息
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style>
.box {
  background-color: skyblue;

  height: 100%;
}
.login-out {
  background-color: #fff;
  padding: 20px 60px;
  border-radius: 30px;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  /* background-color: #f9fafc; */
  height: 100%;
}
</style>
