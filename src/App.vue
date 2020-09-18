<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <HelloWorld msg="Hello Medium"/> -->
    <!-- <div style="height: 550px; overflow-y: scroll;"> -->
    <!-- <div style="height: 500px; overflow-y: scroll;"> -->
    <Tree class="tree-wrapper" :treeData='treeData' :delimeter='"/"' :title='"Tree dir"' :highlightColor="'khaki'"/>
    <!-- </div> -->
    <!-- </div> -->
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
      treeData: ['dir1/subdir1/subsubdir1/subsubsubdir1/subsubsubsubdir1/file_1', 'dir1/subdir1/subsubdir1/subsubsubdir1/subsubsubsubdir1/file_2', 'dir1/subdir1/subsubdir1/file_1', 'dir1/subdir1/subsubdir1/subsubsubdir1/subsubsubsubdir1/file_2', 'dir2/subdir2/subsubdir2/subsubsubdir2/file_2', 'dir3/subdir1/subsubdir1/subsubsubdir1/subsubsubsubdir1/file_1']
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
  // color: red;
  border: 2px solid black;
  font-size: 25px;
  width: max-content;
  height: 400px;

}
</style>
