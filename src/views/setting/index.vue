<template>
  <div class="app-container">
    <el-card shadow="always">
      <el-tabs v-model="activeName">
        <el-tab-pane
          label="用户管理"
          name="first"
        ><el-row>
           <el-col :span="24" /><el-button
             type="primary"
             style="margin-left: 10px"
             @click="dialogVisible = true"
           >新增人员</el-button>
         </el-row>

          <el-table v-loading="loading" border="" :data="roleList">
            <el-table-column
              align="center"
              type="index"
              label="序号"
              width="120"
            />
            <el-table-column
              align="center"
              prop="name"
              label="名称"
              width="240"
            />
            <el-table-column align="center" prop="description" label="描述" />
            <el-table-column align="center" label="操作">
              <template slot-scope="{ row }">
                <el-button size="small" type="success">分配权限</el-button>
                <el-button
                  size="small"
                  type="primary"
                  @click="editRole(row)"
                >编辑</el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="delRole(row.id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- background 添加背景
current-page当前的页面
page-size 每一页展示的条数
page-sizes 每页显示个数选择器的选项设置 total 总共多少条数据
layout 布局
current-change改变当前页码的触发(current.-page值改变的时候触发)
size-change改变页面的数据条数的时候触发(page-size值改变的时候触发) -->
          <el-row type="flex" align="middle" justify="end" style="height: 60px">
            <el-pagination
              v-if="total"
              background
              layout="prev, pager, next ,sizes"
              :total="total"
              :current-page.sync="page.page"
              :page-size.sync="page.pagesize"
              :page-sizes="[2, 5, 10, 20]"
              @current-change="getRoleList"
              @size-change="getRoleList"
            />
          </el-row>
        </el-tab-pane>

        <el-tab-pane
          label="配置管理"
          name="second"
        ><el-alert
           title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
           type="info"
           show-icon
           :closable="false"
         />
          <el-form label-width="120px" style="margin-top: 50px">
            <el-form-item label="公司名称">
              <el-input
                v-model="companyInfo.name"
                disabled
                style="width: 400px"
              />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input
                v-model="companyInfo.companyAddress"
                disabled
                style="width: 400px"
              />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input
                v-model="companyInfo.mailbox"
                disabled
                style="width: 400px"
              />
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                v-model="companyInfo.remarks"
                type="textarea"
                :rows="3"
                disabled
                style="width: 400px"
              />
            </el-form-item> </el-form></el-tab-pane>
      </el-tabs>
    </el-card>
    <addRole
      ref="addRole"
      :dialog-visible.sync="dialogVisible"
      @refreshList="getRoleList()"
    />
  </div>
</template>

<script>
import { getRoleListApi, deleteRoleApi, getComponentApi } from '@/api/setting'
import addRole from '@/views/setting/compoents/addRole'
import { mapGetters } from 'vuex'
export default {
  name: 'HrsaasIndex',
  components: { addRole },
  data() {
    return {
      activeName: 'first',
      page: {
        page: 1,
        pagesize: 10
      },
      total: 0,
      roleList: [],
      loading: false,
      dialogVisible: false,
      companyInfo: {}
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },

  mounted() {
    this.getRoleList()
    this.getComponentInfo()
  },
  methods: {
    async getRoleList() {
      try {
        this.loading = true
        const { rows, total } = await getRoleListApi(this.page)
        this.roleList = rows
        this.total = total
        if (total < 0 && rows.length < 0) {
          this.page.page--
          this.getRoleList()
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    addRole() {
      this.dialogVisible = true
    },
    // 绑定点击事件
    // 拿到当前这行的数据
    // 回显到新增角色的组件上
    editRole(row) {
      // row直接赋值给addRole的roleForm
      // 引用数据类型指向同一个地址，使用浅拷贝优化
      this.$refs.addRole.roleForm = { ...row }
      this.dialogVisible = true
    },
    async delRole(id) {
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await deleteRoleApi(id)
        this.getRoleList()
      } catch (error) {
        console.log('失败')
      }
    },
    async getComponentInfo() {
      const data = await getComponentApi(this.companyId)
      // console.log(data)
      this.companyInfo = data
    }
  }
}
</script>
