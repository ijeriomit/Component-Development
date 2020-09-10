<template>
  <div class ="wrapper" ref="wrapper">
    <div class= "tree-title">
      {{title}}
    </div>
    <div class="highlight" ref="hoverHighlight" ></div>
    <div class="highlight" ref="highlight">
    </div>
    <font-awesome-icon style="width: 40px;" ref="deleteButton" @click="deleteNode" class="delete-icon" :icon="['fa', 'trash-alt']"/>

    <ul class="tree" ref="tree">
      <node @node-clicked="clickedNode"
        @node-hovered="hoveredOnNode($event)"
        @hovered-off-node ="hoveredOffNode()"
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
      hoveredNode: null,
      tree: null
    }
  },
  mounted: function () {
    // this.$refs.hoverHighlight.style.width = this.$refs.tree.offsetWidth + 'px'
    // this.$refs.highlight.style.width = this.$refs.tree.offsetWidth + 'px'
    // this.updatePosition()
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
      var that = this
      node.expanded = !node.expanded
      this.selectedNode = node
      setTimeout(function () {
        that.positionHighlight(that.$refs.highlight, node, 'khaki')
        that.positionDeleteButton(node)
      }, 25)

      if (!node.isFolder && this.onClickFunction instanceof Function) {
        this.onClickFunction(node.path)
      }
    },
    hoveredOnNode: function (node) {
      this.hoveredNode = node
      // this.positionHighlight(this.$refs.hoverHighlight, this.hoveredNode)
    },
    hoveredOffNode: function () {
      this.hoveredNode = null
      this.hideHighLight(this.$refs.hoverHighlight)
    },
    positionDeleteButton: function (node) {
      if (node != null) {
        var elem = document.getElementById(node.path + '/' + node.name)
        // this.hideDeleteIcon()
        this.$refs.deleteButton.style.top = elem.getBoundingClientRect().top + window.scrollY + 'px'
        // this.$refs.deleteButton.style.bottom = elem.getBoundingClientRect().bottom + 'px'
        this.$refs.deleteButton.style.left = (this.$refs.tree.getBoundingClientRect().right - this.$refs.deleteButton.style.width.replace('px', '')) + 'px'
        this.$refs.deleteButton.style.display = 'block'
      }
    },
    positionHighlight: function (highlight, node, color) {
      if (node != null) {
        var elem = document.getElementById(node.path + '/' + node.name)
        this.hideHighLight(highlight)
        if (elem) {
          highlight.style.top = (elem.getBoundingClientRect().top + (window.scrollY)) - elem.offsetHeight + 'px'
          // highlight.style.top = this.$refs.wrapper.offsetParent.offsetTop + this.$refs.tree.offsetTop + elem.scrollTop + 'px'
          // highlight.style.bottom = elem.getBoundingClientRect().top + (window.scrollY) + 'px'
          highlight.style.width = this.$refs.tree.offsetWidth + 'px'
          highlight.style.height = elem.offsetHeight + 'px'
          if (color) {
            highlight.style.backgroundColor = color
          }
          highlight.style.display = 'block'
        } else {
          console.log('node does not exist', node, node.path + '/' + node.name)
        }
      }
    },
    hideHighLight: function (highlight) {
      highlight.style.display = 'none'
    },
    hideDeleteIcon: function () {
      this.$refs.deleteButton.style.display = 'none'
    },
    updatePosition: function () {
      var that = this
      setInterval(() => {
        console.log('in update loop')
        // that.positionHighlight(that.$refs.hoverHighlight, that.hoveredNode)
        that.positionHighlight(that.$refs.highlight, that.selectedNode, that.highlightColor)
        that.positionDeleteButton(that.selectedNode)
      }, 50)
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
  color: red;
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
  // transition: all 0.2s ease-in-out;
  height: 0px;
  overflow: hidden;
}
.highlight{

  border-right: none;
  display: none;
  border-left: none;
  z-index: -1;
  background-color: #babcbe38;
  position: relative;
  width: 100%;
  // border: black 1px solid;
  // transition: all 0.5s linear;
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
