import ElementTree from 'element-tree-grid'
// import Vue from 'vue'
// Vue.component(ElementTree.name, elementTree)
export default {
  data() {
    return {
      categoriesData: [],
      pageSize: 8,
      curPage: 1,
      total: 1,
      loading: true,
      dialogFormAddCategories: false,
      AddCategoriesForm: {
        cat_pid: '',
        cat_name: '',
        categoriesOptions: [],
        selectedOptions: []
      },
      defaultPorps: {
        value: 'cat_id',
        label: 'cat_name'
      }
    }
  },
  created() {
    this.getCategoriesList()
    this.getCategoriesData()
  },
  // 把那个element-tree放到局部组建里
  components: {
    [ElementTree.name]: ElementTree
  },
  methods: {
    handleChange(value) {},
    async getCategoriesData() {
      const res = await this.$axios.get(`/categories`, {
        params: {
          type: 2
        }
      })
      const { data, meta } = res.data
      if (meta.status === 200) {
        this.AddCategoriesForm.categoriesOptions = data
      }
    },
    async getCategoriesList(curPage = 1) {
      this.loading = true
      const res = await this.$axios.get(`/categories`, {
        params: {
          pagenum: curPage,
          pagesize: this.pageSize
        }
      })
      const { data, meta } = res.data
      if (meta.status === 200) {
        this.categoriesData = data.result
        this.total = data.total
        this.loading = false
      }
    },
    changePage(current) {
      this.getCategoriesList(current)
    },
    addCategories() {
      this.dialogFormAddCategories = true
    },
    async dialogCloseCategories() {
      // 点击发送请求
      const info = this.AddCategoriesForm.selectedOptions
      const res = await this.$axios.post(`/categories`, {
        cat_pid: info[info.length - 1],
        cat_level: info.length,
        cat_name: this.AddCategoriesForm.cat_name
      })
      if (res.data.meta.status === 201) {
        this.$message({
          type: 'success',
          message: '创建成功'
        })
        this.dialogFormAddCategories = false
        // 刷新页面重新请求页面
        this.getCategoriesList()
      }
    }
  }
}
