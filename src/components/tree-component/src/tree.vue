<template>
  <div class ="wrapper" ref="wrapper">
    <div class= "tree-title" ref="treeTitle">
      {{title}}
    </div>
    <div class="tree-body" ref="treeBody">
      <div class="hover-highlight" ref="hoverHighlight" ></div>
      <div class="highlight" ref="highlight"></div>
      <ul class="tree" ref="tree">
        <node @node-clicked="clickedNode"
          @delete-node="deleteNode"
          @node-hovered="positionHighlight($refs.hoverHighlight, $event, hoverHighlightColor,  true)"
          @hovered-off-node ="hideHighLight($refs.hoverHighlight)"
          v-for='node in tree.treeObject'
          :key='node.name' :class='{expanded: node.expanded}'
          :node='node'
          :deletable='contentDeletable'>
        </node>
      </ul>
    </div>
  </div>
</template>
<script>
import Tree from './Tree'
import node from './node'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFolder, faFolderOpen, faFile, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

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
    hoverHighlightColor: { type: String, required: false, default: '#babcbe38d' },
    contentDeletable: { type: Boolean, required: false, default: true },
    onClickFunction: { type: Function, required: false },
    onDeleteFunction: { type: Function, required: false }
  },
  components: {
    node
  },
  data: function () {
    return {
      selectedNode: null,
      tree: null
    }
  },
  mounted: function () {
    if (this.tree.treeObject[0] !== undefined) {
      var elem = document.getElementById(this.tree.treeObject[0].getFullPath())
      if (elem) {
        this.$refs.highlight.style.height = elem.offsetHeight + 'px'
        this.$refs.hoverHighlight.style.height = elem.offsetHeight + 'px'
        this.$refs.tree.style.top = -2 * elem.offsetHeight + 'px'
      }
    }
  },
  methods: {
    deleteNode: function (node) {
      if (this.selectedNode === node) {
        var path = ''
        if (node.path === '') {
          path = node.name
        } else {
          path = node.path + '/' + node.name
        }
        this.tree.removeNodeFromTree(path)
        this.selectedNode = null
        this.hideHighLight(this.$refs.highlight)
        if (this.onDeleteFunction instanceof Function) {
          this.onDeleteFunction(node.name)
        }
      }
    },
    clickedNode: function (node) {
      node.expanded = !node.expanded
      node.selected = true
      if (this.selectedNode !== null && this.selectedNode !== node) {
        this.selectedNode.selected = false
      }
      this.selectedNode = node
      this.positionHighlight(this.$refs.highlight, node, this.highlightColor, false)
      if (!node.isFolder && this.onClickFunction instanceof Function) {
        this.onClickFunction(node.path)
      }
    },
    positionHighlight: function (highlight, node, color, hover) {
      var elem = document.getElementById(node.getFullPath())
      this.hideHighLight(highlight)

      if (elem) {
        setTimeout(() => {
          if (hover === true) {
            highlight.style.top = elem.getBoundingClientRect().top - (this.$refs.treeTitle.offsetHeight + elem.offsetHeight + highlight.offsetHeight) + window.scrollY + this.$refs.wrapper.parentElement.scrollTop + this.$refs.treeBody.scrollTop + 'px'
          } else {
            highlight.style.top = elem.getBoundingClientRect().top - (this.$refs.treeTitle.offsetHeight + elem.offsetHeight + (2 * highlight.offsetHeight)) + window.scrollY + this.$refs.wrapper.parentElement.scrollTop + this.$refs.treeBody.scrollTop + 'px'
          }
          highlight.style.backgroundColor = color

          highlight.style.visibility = 'visible'
        }, 100
        )
      }
    },
    hideHighLight: function (highlight) {
      highlight.style.visibility = 'hidden'
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
  align-self: flex-start;
  padding-left: 15px;
  padding-right: 45px;
  z-index: 0;
  margin-top: 15px;
  position: relative;
}
.tree-body{
  height: 90%;
  overflow-y: scroll;
  overflow-x: scroll;
  order: 2;
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
  transition: all 0.2s ease-in-out;
  height: 0px;
  overflow: hidden;
}
.highlight{
  visibility: hidden;
  z-index: -1;
  top: 100%;
  height: 0px;
  background-color: #babcbe38;
  position: relative;
  width: 100%;
  bottom: -0px;
  pointer-events: none;
}
.hover-highlight{
  @extend .highlight;
  z-index: -2;
}

</style>
