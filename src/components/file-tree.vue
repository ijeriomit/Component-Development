<template>
  <div></div>
</template>
<script>
import FileTree from '@/models/FileTree'
export default {
  name: 'file-tree',
  props: {
    treeData: { type: Array, required: true },
    delimeter: { type: String, required: true },
    sort: { type: Function, required: false }
  },
  data: function () {
    return {
      selectedFile: '',
      fileTree: null
    }
  },
  mounted: function () {
    this.fileTree = new FileTree(this.treeData, this.delimeter).tree
    console.log('FileTree: ', this.fileTree)
  }
}
</script>
<style lang="scss">
</style>
