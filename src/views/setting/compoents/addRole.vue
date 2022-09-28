<template>
  <el-dialog
    title="新增角色"
    width="60%"
    :visible="dialogVisible"
    :before-close="handleClose"
  >
    <el-form ref="roleDialogForm" label-width="80px" :model="roleForm">
      <el-form-item
        prop="name"
        label="角色"
        :rules="[{ required: true, message: '请输入角色', trigger: 'blur' }]"
      >
        <el-input v-model="roleForm.name" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="roleForm.description" type="textarea" row="3" />
      </el-form-item>
    </el-form>
    <el-row
      slot="footer"
      type="flex"
      justify="center"
      align="middle"
      class="dialog-footer"
    >
      <el-button @click="handleClose">取 消</el-button>
      <el-button
        v-loading="loading"
        type="primary"
        @click="handleAdd"
      >确 定</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { addRoleApi } from '@/api/setting'

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      roleForm: {
        name: '',
        description: ''
      },
      loading: false
    }
  },
  methods: {
    handleClose() {
      // 表单效果重置
      this.$refs.roleDialogForm.resetFields()
      this.$emit('update:dialogVisible', false)
    },
    async handleAdd() {
      try {
        await this.$refs.roleDialogForm.validate()
        this.loading = true
        await addRoleApi(this.roleForm)
        this.$message.success('角色新增成功')
        this.$emit('refreshList')
        this.handleClose()
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style></style>
