export default {
  data() {
    return {
      treeShowDialogId: -1,
      rolesDataTable: [],
      editRolesDialog: false,
      editRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      storageId: -1,
      treeVisible: false,
      // 所有的权限数据
      allRigthsTreeData: [],
      defaultProps: {
        children: 'children',

        // label 用来指定
        label: 'authName'
      }
    }
  },
  created() {
    this.getRolesList()
    this.getRightsList()
  },
  methods: {
    async getRolesList() {
      const res = await this.$axios.get('/roles')
      const { data, meta } = res.data
      if (meta.status === 200) {
        this.rolesDataTable = data
      }
    },
    async getRightsList() {
      const res = await this.$axios.get('/rights/tree')
      console.log(res)
      const { data, meta } = res.data
      if (meta.status === 200) {
        this.allRigthsTreeData = data
      }
    },
    async delRolesrigth(rightId, roleId) {
      console.log(rightId, roleId)
      const res = await this.$axios.delete(`/roles/${roleId}/rights/${rightId}`)
      const { data, meta } = res.data
      if (meta.status === 200) {
        // 这里跟新列表  还有是不是应该搞一个那个消息框
        const rolesDataindex = this.rolesDataTable.findIndex(
          item => item.id === roleId
        )
        this.rolesDataTable[rolesDataindex].children = data
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }
    },
    async editUpdataRoles(id) {
      this.editRolesDialog = true
      this.storageId = id
      // 这里把原来的数据渲染上去
      const res = await this.$axios.get(`/roles/${id}`)
      console.log(res)
      const { data, meta } = res.data
      if (meta.status === 200) {
        this.editRolesForm.roleName = data.roleName
        this.editRolesForm.roleDesc = data.roleDesc
      }
    },
    async editRolesConfirm() {
      const id = this.storageId
      const res = await this.$axios.put(`/roles/${id}`, {
        roleName: this.editRolesForm.roleName,
        roleDesc: this.editRolesForm.roleDesc
      })
      const { data, meta } = res.data
      console.log(data)
      if (meta.status === 200) {
        this.editRolesDialog = false
        const rolesDataitem = this.rolesDataTable.find(item => item.id === id)
        rolesDataitem.roleDesc = data.roleDesc
        rolesDataitem.roleName = data.roleName
      }
    },
    delRoles(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios.delete(`/roles/${id}`).then(res => {
            console.log(res)
            if (res.data.meta.status === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getRolesList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    treeShowDialog(curChiledren, id) {
      this.treeShowDialogId = id
      this.treeVisible = true

      // setCheckedKeys() {
      this.$nextTick(() => {
        const levelId = []
        console.log(curChiledren)
        curChiledren.forEach(level1 => {
          level1.children.forEach(level2 => {
            level2.children.forEach(level3 => {
              levelId.push(level3.id)
            })
          })
        })
        this.$refs.allRigthsTreeData.setCheckedKeys(levelId)
      })
      // }
    },
    async getTreeChecked() {
      const id = this.treeShowDialogId
      const allR = this.$refs.allRigthsTreeData.getCheckedKeys()
      const addRo = this.$refs.allRigthsTreeData.getHalfCheckedKeys()
      const allTree = [...allR, ...addRo]
      const res = await this.$axios.post(`/roles/${id}/rights`, {
        rids: allTree.join(',')
      })
      console.log(res)
      if (res.data.meta.status === 200) {
        this.treeVisible = false
        this.getRolesList()
      }
    }
  }
}
