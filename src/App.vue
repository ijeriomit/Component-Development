<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Hello Medium"/>
    <file-tree :treeData='treeData' delimeter='/'/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import FileTree from './components/file-tree.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    FileTree
  },
  data: function () {
    return {
      treeData: ['dir1/subdir1/file1', 'dir2/subdir2/file2']
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
