<template>
  <el-container class="home-out">
    <el-header>

      <el-row>
        <el-col :span="8" class="login-box"><img src="../../assets/logo.png" alt=""></el-col>
        <el-col :span="8" class="header-title">
          <h3>电商后台管理系统</h3>
        </el-col>
        <el-col :span="8">
          <div class="title-out">上海黑马前段25期会员
            <a href="javascript:;" @click="loginOut">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu :router="true" :default-active="$route.path.slice(1)" :unique-opened="true" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
          <el-submenu :index="menu1.id+''" v-for="menu1 in meunsList" :key="menu1.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{menu1.authName}}</span>
            </template>

            <el-menu-item :index="'/'+menu2.path" v-for="menu2 in menu1.children" :key="menu2.id">
              <i class="el-icon-menu"></i>
              <span slot="title">{{menu2.authName}}</span>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getMenuslistData()
  },
  data() {
    return {
      meunsList: []
    }
  },
  methods: {
    async getMenuslistData() {
      const res = await this.$axios.get(`/menus`)
      const { data, meta } = res.data
      if (meta.status === 200) {
        this.meunsList = data
      }
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    loginOut() {
      console.log(111)
      this.$confirm('是否要退出, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '退出账号成功!'
          })
          localStorage.removeItem('token')
          this.$router.push('/login')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          })
        })
    }
  }
}
</script>

<style scoped>
.title-out {
  height: 60px;
  line-height: 60px;
  text-align: right;
  font-weight: bold;
}
.title-out a {
  color: sienna;
}
.title-out a:hover {
  color: #fff;
}
.header-title h3 {
  color: #fff;
  font-size: 35px;
  margin: 0;
  height: 60px;
  line-height: 60px;
}
.login-box {
  text-align: left;
}
.home-out {
  height: 100%;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  /* line-height: 60px; */
}

.el-aside {
  background-color: #545c64;
  color: #333;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  /* line-height: 160px; */
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
