<template>
  <div class ="wrapper" ref="wrapper">
    <div class= "tree-title" ref="treeTitle">
      {{title}}
    </div>
    <search-bar class="search-button"
    :searchOnType="true"
    :exampleSearchTerm="'dir'"
    :searchFunction="function(searchKey){ return tree.traverseTree(tree.treeObject, tree.searchCheck , [], searchKey)}"
    :onSearchResultClick="()=>{}"
    :showSearchResults="true"
    :buttonOrientationRight="true"
    :placeHolderText="'Type to Search...'"
    :darkSearchResultTheme="false"
    >
    </search-bar>
    <div class="tree-body" ref="treeBody">
      <ul class="tree" ref="tree">
        <node @node-clicked="clickedNode"
          @delete-node="deleteNode"
          v-for='node in tree.treeObject'
          :key='node.name' :class='{expanded: node.expanded}'
          :node='node'
          :deletable='contentDeletable'
          :highlightHeight='highlightHeight'
          :highlightWidth='highlightWidth'
          :highlightColor='highlightColor'
          :hoverHighlightColor='hoverHighlightColor'>
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
import SearchBar from '@/components/search-bar-component/search-bar.vue'
export default {
  name: 'tree',
  created: function () {
    library.add(faFolder, faFolderOpen, faFile, faTrashAlt)
    this.tree = new Tree(this.treeData, this.delimeter, this.sort)
  },
  props: {
    treeData: { type: Array, required: true },
    delimeter: { type: String, required: true },
    sort: { type: Function, required: false, default: null },
    title: { type: String, required: false },
    highlightColor: { type: String, required: false, default: 'khaki' },
    hoverHighlightColor: { type: String, required: false, default: 'darkgray' },
    contentDeletable: { type: Boolean, required: false, default: true },
    onClickFunction: { type: Function, required: false },
    onDeleteFunction: { type: Function, required: false }
  },
  components: {
    node,
    'search-bar': SearchBar
  },
  data: function () {
    return {
      selectedNode: null,
      tree: null,
      highlightWidth: '',
      highlightHeight: ''
    }
  },
  mounted: function () {
    if (this.tree.treeObject[0] !== undefined) {
      var elem = document.getElementById(this.tree.treeObject[0].getFullPath())
      if (elem) {
        this.highlightWidth = this.$refs.treeBody.offsetWidth + 'px'
        this.highlightHeight = elem.offsetHeight + 'px'
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
      if (!node.isFolder && this.onClickFunction instanceof Function) {
        this.onClickFunction(node.path)
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

.search-bar{
  color: blue;
  background-color: wheat;
}
.tree{
  border: none;
  align-self: flex-start;
  padding-left: 15px;
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
