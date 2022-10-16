<template>
  <div>
    <el-upload
      v-loading="loading"
      class="upload"
      action="#"
      :file-list="fileList"
      list-type="picture-card"
      :on-preview="onPreview"
      :on-remove="onRemove"
      :on-change="onChange"
      :http-request="onHttpRequest"
      :limit="1"
      :before-upload="beforeUpload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <img style="width: 100%" :src="fileUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDCICjARYXNAoIahfQBm9NUO4XnqeHhsoY',
  SecretKey: 'ax61BAxYzGLCoBLI4e4JMDpEPOBoFUbW'
})
export default {
  name: 'UploadImg',
  props: { defaultUrl: { type: String, default: '' }},
  data: function() {
    return {
      fileList: [
        // {
        //   name: 'food.jpeg',
        //   url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        // }
      ],
      dialogVisible: false,
      fileUrl: '',
      loading: false
    }
  },
  watch: {
    defaultUrl() {
      this.fileList.push({ name: 'default', url: this.defaultUrl })
    }
  },
  methods: {
    beforeUpload(file) {
      // 控制图片格式
      const formatImg = ['image/gif', 'image/jpeg']
      const isLt1M = 1 * 1024 * 1024

      const isFormat = formatImg.includes(file.type)
      if (!isFormat) {
        this.$message.error('格式必须是' + formatImg.join(',') + '类型')
        return false
      }
      if (file.size > isLt1M) {
        this.$message.error('上传头像图片大小不能超过 1MB!')
        return false
      }
    },
    // 点击删除触发
    onRemove(file, fileList) {
      // fileList删除之后的新列表
      this.fileList = fileList
      // console.log(file, fileList)
    },
    // 点击预览触发
    onPreview(file) {
      this.dialogVisible = true
      this.fileUrl = file.url
      console.log(file)
    },
    // 上传文件自动触发，会触发2次并且上传成功和失败都会触发
    // 第一次 本地选择上传 原有数据+选择的数据
    // 第二次 远程请求上传成功/失败 fileList只有原有数据
    onChange(file, fileList) {
      // fileList上传之后的新列表
      // this.fileList.push(file)
      this.fileList = fileList
      // console.log(file, fileList)
    },
    // 自定义发送请求行为，覆盖默认远程请求的行为让图片传入腾讯云，让onChange只触发一次，远程请求进入自定义
    onHttpRequest({ file }) {
      this.loading = true
      cos.uploadFile(
        {
          Bucket: 'sheep-1314348586' /* 填写自己的bucket，必须字段 */,
          Region: 'ap-shanghai' /* 存储桶所在地域，必须字段 */,
          Key: file.name /* 存储在桶里的对象键（例如:1.jpg，a/b/test.txt，图片.jpg）支持中文，必须字段 */,
          Body: file, // 上传文件对象
          SliceSize:
            1024 *
            1024 *
            5 /* 触发分块上传的阈值，超过5MB使用分块上传，小于5MB使用简单上传。可自行设置，非必须 */,
          onProgress: function(progressData) {
            console.log(JSON.stringify(progressData))
          }
        },
        (err, data) => {
          if (err) {
            console.log('上传失败', err)
          } else {
            this.$message.success('上传成功')
            const imgURL = 'https://' + data.Location
            this.$emit('updataimg', imgURL)
            this.loading = false
          }
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.upload {
  width: 148px;
  height: 148px;
  overflow: hidden;
}
</style>
