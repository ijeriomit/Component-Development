<template>
  <div class="tree-wrapper">
    <div class= "tree-title">
      {{title}}
    </div>
    <ul class="tree">
      <node @nodeClicked="clickedNode"
        @nodeDeleted="deleteNode"
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
      if (this.onClickFunction instanceof Function) {
        this.onClickFunction(node.name)
      }
    }

  },
  mounted: function () {
    this.tree = new Tree(this.treeData, this.delimeter)
  }
}
</script>
<style lang="scss">
$text-color: black;
$background-color: white;
$border:2px solid $text-color;
$font-size: 25px;
.tree-wrapper{
  display: flex;
}
</style>
