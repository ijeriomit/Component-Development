<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <HelloWorld msg="Hello Medium"/> -->
    <Tree class="tree-wrapper" :treeData='treeData' :delimeter='"/"' :title='"Tree dir"'/>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import Tree from './components/tree-component/src/tree.vue'
export default {
  name: 'App',
  components: {
    Tree
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
.tree-wrapper{
   color: black;
   border:2px solid black;
   font-size: 25px;

}
</style>
