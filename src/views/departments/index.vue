<template>
  <div v-loading="loading">
    <el-card class="departments-container">
      <div slot="header" class="clearfix">
        <treeTool :tree-data="company" :is-root="false" @addDept="addDept" />
      </div>
      <!-- 树形组件 -->
      <el-tree :data="departs" :default-expand-all="true" :props="defaultProps">
        <treeTool
          slot-scope="{ data }"
          :tree-data="data"
          @addDept="addDept"
          @editDept="editDept"
          @getDepartments="getDepartments"
        />
      </el-tree>
    </el-card>
    <addDept
      ref="addDept"
      :dialog-visible.sync="dialogVisible"
      :current-node="currentNode"
    />
  </div>
</template>

<script>
import treeTool from '@/views/departments/compont/tree-tool'
import { getDepartmentsApi } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import addDept from '@/views/departments/compont/add-dept'
export default {
  name: 'HrsaasIndex',
  components: { treeTool, addDept },
  data() {
    return {
      departs: [],
      defaultProps: {
        label: 'name'
      },
      company: {},
      dialogVisible: false,
      currentNode: {},
      loading: false
    }
  },
  mounted() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      try {
        this.loading = true
        const data = await getDepartmentsApi()
        // console.log(data)
        this.departs = tranListToTreeData(data.depts, '')
        this.company = {
          name: data.companyName,
          manager: data.companyManager,
          id: ''
        }
      } finally {
        this.loading = false
      }
    },
    addDept(node) {
      this.dialogVisible = true
      this.currentNode = node
    },
    editDept(node) {
      this.dialogVisible = true
      this.currentNode = node
      this.$refs.addDept.formData = { ...this.currentNode }
    }
  }
}
</script>

<style lang="scss" scoped>
.departments-container {
  width: 900px;
  margin: 20px auto;
  .el-tree {
    .el-tree-node__content {
      padding-right: 20px;
    }
  }
}
</style>
