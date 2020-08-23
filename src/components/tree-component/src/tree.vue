<template>
  <div class ="wrapper">
    <div class= "tree-title">
      {{title}}
    </div>
    <div class="highlight" ref="hoverHighlight" ></div>
    <div class="highlight" ref="highlight"></div>
    <ul class="tree" ref="tree">
      <node @node-clicked="clickedNode"
        @node-deleted="deleteNode"
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
    highlightColor: { type: String, required: false, default: 'khaki' },
    contentDeletable: { type: Boolean, required: false },
    onClickFunction: { type: Function, required: false },
    onDeleteFunction: { type: Function, required: false }
  },
  components: {
    node
  },
  data: function () {
    return {
      selectedFile: null,
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
    fileClicked: function (node) {
      if (this.selectedFile != null) {
        this.selectedFile.selected = false
      }
      this.selectedFile = node
      this.selectedFile.selected = true
    },
    clickedNode: function (node) {
      node.expanded = !node.expanded
      if (!node.isFolder) {
        this.fileClicked(node)
      }
      this.positionHighlight(this.$refs.highlight, node, true)
      if (this.onClickFunction instanceof Function) {
        this.onClickFunction(node.name)
      }
    },
    positionHighlight: function (highlight, node, color) {
      var elem = document.getElementById(node.path)
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
  z-index: -1000;
  background-color: #babcbe38;
  position: absolute;
  // border: black 1px solid;
  transition: all 0.5s linear;
}
.hover-hightlight{
  @extends .highlight;
  background-color: khaki;
}
</style>
