<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%"
  >
    <el-col><span>{{ treeData.name }}</span></el-col>

    <el-col :span="4">
      <el-row type="flex">
        <el-col>
          <span>{{ treeData.manager }}</span>
        </el-col>
        <el-col>
          <el-dropdown @command="handleCommand">
            <span> 操作<i class="el-icon-arrow-down el-icon--right" /> </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item
                v-if="isRoot"
                command="edit"
              >编辑部门</el-dropdown-item>
              <el-dropdown-item
                v-if="isRoot"
                command="del"
              >删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  props: {
    treeData: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    async handleCommand(type) {
      if (type === 'add') {
        this.$emit('addDept', this.treeData)
      } else if (type === 'edit') {
        this.$emit('editDept', this.treeData)
      } else {
        this.$confirm('是否确认删除该部门', '提示', { type: 'warning' })
          .then((res) => {
            // 点击确认调用删除接口
            return delDepartments(this.treeData.id)
          })
          .then((res) => {
            this.$message.success('删除成功')
            this.$emit('getDepartments')
          })
      }
    }
  }
}
</script>

<style></style>
