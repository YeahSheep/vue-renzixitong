<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <uploadImg @updataimg="updataimgURL1" />
    <uploadImg @updataimg="updataimgURL2" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import uploadImg from '@/components/UploadImg'
export default {
  name: 'Dashboard',
  // components: { uploadImg },
  computed: {
    ...mapGetters(['name'])
  },
  methods: {
    updataimgURL1(imgURL) {
      console.log('456' + imgURL)
    },
    updataimgURL2(imgURL) {
      console.log('123' + imgURL)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
