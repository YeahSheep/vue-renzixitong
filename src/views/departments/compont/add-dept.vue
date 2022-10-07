<template>
  <!-- 新增编辑的弹层 -->
  <el-dialog :title="showTitle" :visible="dialogVisible">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="addForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="formData.name"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="formData.code"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="formData.manager"
          style="width: 80%"
          placeholder="请选择"
          @focus="getEmployeeSimple"
        >
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="formData.introduce"
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button
          v-loading="loading"
          type="primary"
          size="small"
          @click="btnOK"
        >确定</el-button>
        <el-button size="small" @click="handleClose">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {
  getDepartmentsApi,
  addDepartments,
  updateDepartments
} from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    currentNode: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    // 部门编码规则，在整个页面中不能重复
    // 拿到所有的部门数据，一个一个的比较，如果出现重复的，则校验不通过
    const checkCode = async(rule, value, callback) => {
      const { depts } = await getDepartmentsApi()
      // 校验结果初始值为通过
      let isRepeat = true
      // 如果是编辑状态,校验规则中需要排除自己
      if (this.formData.id) {
        isRepeat = depts.some(
          // 如果遍历项的id=当前点击项的id,则不进行后面code的判断(短路运算)
          (item) => item.id !== this.formData.id && item.code === value
        )
      } else {
        // 新增状态只需要校验输入的code在整个页面中不重复
        isRepeat = depts.some((ele) => ele.code === value)
      }
      isRepeat ? callback(new Error(`模块下已存在${value}编码`)) : callback()
    }

    // 部门名称规则,需要支持两种 新增模式 / 编辑模式
    const checkName = async(rule, value, callback) => {
      const { depts } = await getDepartmentsApi()
      let isRepeat = true
      if (this.formData.id) {
        // 有id就是编辑模式
        // 编辑 张三 => 校验规则 除了我之外 同级部门下 不能有叫张三的
        isRepeat = depts
          .filter(
            // 编辑项的pid和遍历的pid相等的项则时同一个部门的子部门
            // item.id !== this.formData.id用来排除自己
            (item) =>
              item.pid === this.formData.pid && item.id !== this.formData.id
          )
          .some((item) => item.name === value)
        // console.log(isRepeat)
      } else {
        // 否则就是新增模式
        //  新增时同级部门禁止出现重复的部门, 如果传入的点击项id===获取数据pid，则说明这些数据是一个父级下的
        isRepeat = depts
          // 找到当前父级下的同级部门返回一个新数组
          .filter((item) => item.pid === this.currentNode.id)
          // 进行筛选,如果输入的名字和父级中任意一个部门的名字相同则返回校验失败
          .some((item) => item.name === value)
      }
      isRepeat ? callback(new Error(`模块下已存在${value}部门`)) : callback()
    }
    return {
      // 定义表单数据
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 定义校验规则
      rules: {
        name: [
          { required: true, message: '部门名称必填', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称1-50个字符', trigger: 'blur' },
          {
            validator: checkName,
            trigger: 'blur'
          }
        ],
        code: [
          { required: true, message: '部门编码必填', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码1-50个字符', trigger: 'blur' },
          {
            validator: checkCode,
            trigger: 'blur'
          }
        ],
        manager: [{ required: true, message: '部门负责人必填' }],
        introduce: [
          { required: true, message: '部门介绍必填', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍1-300个字符', trigger: 'blur' }
        ]
      },
      peoples: [], // 获取的员工列表的数据
      loading: false
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增新增'
    }
  },
  methods: {
    // 点击取消按钮，将false传回
    handleClose() {
      this.$emit('update:dialogVisible', false)
      // resetFields校验结果恢复初始值(清空输入框)
      this.$refs.addForm.resetFields()
      // 让formData恢复初始值
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
    },
    async getEmployeeSimple() {
      const data = await getEmployeeSimple()
      // console.log(data)
      this.peoples = data
    },

    // 点击确定
    async btnOK() {
      // 表单进行校验，成功后调用接口
      try {
        await this.$refs.addForm.validate()
        this.loading = true
        if (this.formData.id) {
          // 有id调用编辑接口
          await updateDepartments(this.formData)
        } else {
          // 无id调用新增接口
          await addDepartments({
            ...this.formData,
            pid: this.currentNode.id
          })
        }
        // 接口调用成功后通知父组件重新渲染列表
        this.$parent.getDepartments()
        // 渲染成功弹出添加成功并关闭弹窗
        this.handleClose()
        this.$message.success(`${this.formData.id}?'编辑成功':'添加成功'`)
      } catch (error) {
        this.$message.error('添加失败')
      } finally {
        // 接口调用成功失败加载图标都要变为false
        this.loading = false
      }
    }
  }
}
</script>

<style></style>
