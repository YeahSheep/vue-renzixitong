<template>
  <div>
    <UploadExcel :on-success="handleSuccess" />
  </div>
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  methods: {
    async handleSuccess({ header, results }) {
      const userRelations = {
        入职日期: 'timeOfEntry',
        手机号: 'mobile',
        姓名: 'username',
        转正日期: 'correctionTime',
        工号: 'workNumber'
      }
      const arr = []
      results.forEach((item) => {
        const userInfo = {}
        // Object.keys(item)是results中每一项的中文属性名
        Object.keys(item).forEach((key) => {
          // userRelations[key]
          // item是results中的每一个对象，item[key]可以拿到每一个对象的属性值
          userInfo[userRelations[key]] = item[key]
        })
        arr.push(userInfo)
      })
      await importEmployee(arr)
      this.$router.back()
    }
  }
}
</script>

<style></style>
