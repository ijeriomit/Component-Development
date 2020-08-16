<template>
  <div class ="wrapper">
    <div class= "tree-title">
      {{title}}
    </div>
    <ul class="tree">
      <node @node-clicked="clickedNode"
        @node-deleted="deleteNode"
        v-for='node in tree.treeObject'
        :key='node.name' :class='{expanded: node.expanded}'
        :node='node'
        :deletable='contentDeletable'>
      </node>
    </ul>
  </div>
</template>
<script>
import Tree from './Tree'
import node from './node'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFolder, faFolderOpen, faFile } from '@fortawesome/free-solid-svg-icons'
export default {
  name: 'tree',
  created: function () {
    library.add(faFolder, faFolderOpen, faFile)
    this.tree = new Tree(this.treeData, this.delimeter)
  },
  props: {
    treeData: { type: Array, required: true },
    delimeter: { type: String, required: true },
    sort: { type: Function, required: false },
    title: { type: String, required: false },
    contentDeletable: { type: Boolean, required: false },
    onClickFunction: { type: Function, required: false },
    onDeleteFunction: { type: Function, required: false }
  },
  components: {
    node
  },
  data: function () {
    return {
      selectedNode: '',
      tree: null
    }
  },
  methods: {
    deleteNode: function (node) {
      this.tree.removeNodeFromTree(node)
      if (this.onDeleteFunction instanceof Function) {
        this.onDeleteFunction(node.name)
      }
    },
    clickedNode: function (node) {
      node.expanded = !node.expanded
      console.log('Node Clicked: ', node.name)
      if (this.onClickFunction instanceof Function) {
        this.onClickFunction(node.name)
      }
    }

  }
}
</script>
<style lang="scss" scoped>
$text-color: black;
$background-color: white;
$border:2px solid $text-color;
$font-size: 25px;
.tree{
  border: none;
  order: 1;
  align-self: flex-start;
  padding-left: 15px;
  padding-right: 15px;
}
.tree-title{
  width: 100%;
  height: fit-content;
  order: 1;
  text-align: center;
  font-size: larger;
  border-top: none;
  border-right: none;
  border-left: none;
  border-bottom: inherit;
}
.wrapper{
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  color: black;
  border: 2px solid black;
  font-size: 25px;
  width: max-content;
}
.expanded{
  height: fit-content;
}
.folder{
  transition: all 0.3s ease-in-out;
  height: 0px;
  overflow: hidden;
}
</style>
