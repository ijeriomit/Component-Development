<template>
  <div class ="wrapper">
    <div class= "tree-title">
      {{title}}
    </div>
    <div class="highlight" ref="hoverHighlight" ></div>
    <div class="highlight" ref="highlight">
    </div>
    <font-awesome-icon style="width: 40px;" ref="deleteButton" @click="deleteNode" class="delete-icon" :icon="['fa', 'trash-alt']"/>

    <ul class="tree" ref="tree">
      <node @node-clicked="clickedNode"
        @node-hovered="positionHighlight($refs.hoverHighlight, $event)"
        @hovered-off-node ="hideHighLight($refs.hoverHighlight, $event)"
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
import { faFolder, faFolderOpen, faFile, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
  name: 'tree',
  created: function () {
    library.add(faFolder, faFolderOpen, faFile, faTrashAlt)
    this.tree = new Tree(this.treeData, this.delimeter)
  },
  props: {
    treeData: { type: Array, required: true },
    delimeter: { type: String, required: true },
    sort: { type: Function, required: false },
    title: { type: String, required: false },
    highlightColor: { type: String, required: false, default: 'khaki' },
    contentDeletable: { type: Boolean, required: false },
    onClickFunction: { type: Function, required: false },
    onDeleteFunction: { type: Function, required: false }
  },
  components: {
    node,
    FontAwesomeIcon
  },
  data: function () {
    return {
      selectedNode: null,
      tree: null
    }
  },
  methods: {
    deleteNode: function () {
      console.log('deleted file', this.selectedNode)
      var path = ''
      if (this.selectedNode.path === '') {
        path = this.selectedNode.name
      } else {
        path = this.selectedNode.path + '/' + this.selectedNode.name
      }
      this.tree.removeNodeFromTree(path)
      this.hideDeleteIcon()
      this.hideHighLight(this.$refs.highlight)
      if (this.onDeleteFunction instanceof Function) {
        this.onDeleteFunction(node.name)
      }
    },
    clickedNode: function (node) {
      node.expanded = !node.expanded
      this.selectedNode = node
      this.positionHighlight(this.$refs.highlight, node, true)
      this.positionDeleteButton(node)
      if (!node.isFolder && this.onClickFunction instanceof Function) {
        this.onClickFunction(node.path)
      }
    },
    positionDeleteButton: function (node) {
      var elem = document.getElementById(node.path + '/' + node.name)
      this.hideDeleteIcon()
      this.$refs.deleteButton.style.top = elem.getBoundingClientRect().top + 'px'
      this.$refs.deleteButton.style.bottom = elem.getBoundingClientRect().bottom + 'px'
      this.$refs.deleteButton.style.left = (this.$refs.tree.getBoundingClientRect().right - this.$refs.deleteButton.style.width.replace('px', '')) + 'px'
      this.$refs.deleteButton.style.display = 'block'
    },
    positionHighlight: function (highlight, node, color) {
      var elem = document.getElementById(node.path + '/' + node.name)
      this.hideHighLight(highlight)
      highlight.style.top = elem.getBoundingClientRect().top + 'px'
      highlight.style.bottom = elem.getBoundingClientRect().bottom + 'px'
      highlight.style.width = this.$refs.tree.offsetWidth + 'px'
      highlight.style.height = elem.offsetHeight + 'px'
      if (color) {
        highlight.style.backgroundColor = this.highlightColor
      }
      highlight.style.display = 'block'
    },
    hideHighLight: function (highlight) {
      highlight.style.display = 'none'
    },
    hideDeleteIcon: function () {
      this.$refs.deleteButton.style.display = 'none'
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
  padding-right: 45px;
  z-index: 0;
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
  border: 1.20px solid black;
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
.highlight{

  border-right: none;
  display: none;
  border-left: none;
  z-index: -1;
  background-color: #babcbe38;
  position: absolute;
  // border: black 1px solid;
  transition: all 0.5s linear;
}
.hover-hightlight{
  @extends .highlight;
  background-color: khaki;
}
.delete-icon{
  float: right;
  right: 10px;
  display: none;
  z-index: 1;
  position: absolute;
  cursor: pointer;
}
</style>
