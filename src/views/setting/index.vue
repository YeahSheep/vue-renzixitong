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
              <el-button size="small" type="success">分配权限</el-button>
              <el-button size="small" type="primary">编辑</el-button>
              <el-button size="small" type="danger">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="配置管理" name="second">公司信息</el-tab-pane>
      </el-tabs>
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
    </el-card>
    <addRole
      :dialog-visible.sync="dialogVisible"
      @refreshList="getRoleList()"
    />
  </div>
</template>

<script>
import { getRoleListApi } from '@/api/setting'
import addRole from '@/views/setting/compoents/addRole'
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
      dialogVisible: false
    }
  },

  mounted() {
    this.getRoleList()
  },

  methods: {
    async getRoleList() {
      try {
        this.loading = true
        const { rows, total } = await getRoleListApi(this.page)
        this.roleList = rows
        this.total = total
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
