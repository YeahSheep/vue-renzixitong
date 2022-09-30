<template>
  <div>
    <el-card class="departments-container">
      <div slot="header" class="clearfix">
        <treeTool
          :tree-data="company"
          :is-root="false"
          @addDept="handleNodeClick"
        />
      </div>
      <!-- 树形组件 -->
      <el-tree :data="departs" :default-expand-all="true" :props="defaultProps">
        <treeTool
          slot-scope="{ data }"
          :tree-data="data"
          @addDept="handleNodeClick"
        />
      </el-tree>
      <addDept
        :dialog-visible.sync="dialogVisible"
        :current-node="currentNode"
      />
    </el-card>
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
      currentNode: {}
    }
  },
  mounted() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const data = await getDepartmentsApi()
      console.log(data)
      this.departs = tranListToTreeData(data.depts, '')
      this.company = {
        name: data.companyName,
        manager: data.companyManager,
        id: ''
      }
    },
    handleNodeClick(node) {
      this.dialogVisible = true
      this.currentNode = node
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
