<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <el-tabs v-model="activeName" @tab-click="tabchange">
          <el-tab-pane lazy label="用户管理" name="first">
            <el-form
              ref="form"
              :model="userInfoForm"
              :rules="rules"
              label-width="80px"
            >
              <el-form-item label="姓名" prop="username">
                <el-input v-model="userInfoForm.username" />
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="userInfoForm.password" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="updataUserInfo"
                >更新</el-button>
              </el-form-item>
            </el-form></el-tab-pane>
          <el-tab-pane
            lazy
            label="配置管理"
            name="second"
          ><UserInfo /></el-tab-pane>

          <el-tab-pane
            lazy
            label="角色管理"
            name="third"
          ><JobInfo /></el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById, saveUserDetailById } from '@/api/employees'
import UserInfo from '@/views/employees/compontents/user-info'
import JobInfo from '@/views/employees/compontents/job-info'
import Cookies from 'js-cookie'

export default {
  components: { UserInfo, JobInfo },
  data() {
    return {
      activeName: Cookies.get('activeName') || 'first',
      userInfoForm: {},
      rules: {
        username: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, message: '密码长度6-9位', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById() {
      const data = await getUserDetailById(this.$route.params.id)
      //   console.log(data)
      this.userInfoForm = data
    },
    async updataUserInfo() {
      try {
        await this.$refs.form.validate()
        await saveUserDetailById(this.userInfoForm)
        this.$message.success('保存成功')
        this.$router.push('/employees')
      } catch (error) {
        console.log(error)
      }
    },
    tabchange() {
      Cookies.set('activeName', this.activeName)
    }
  }
}
</script>

<style></style>
