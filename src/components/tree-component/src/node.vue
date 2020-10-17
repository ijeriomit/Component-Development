<template>
    <li >
        <div class = "title-wrapper">
          <div v-show="node.selected" class="highlight" :style="{ height: highlightHeight, width: highlightWidth, backgroundColor: highlightColor}" ref="highlight"> </div>
          <div v-show="hovered" class="hover-highlight" :style="{ height: highlightHeight, width: highlightWidth, backgroundColor: hoverHighlightColor}" ref="hoverHighlight"> </div>
          <div @mouseover="hovered = true" @mouseleave="hovered=false"  class="node-title" :id="node.getFullPath()"  @click="onClick">
            <div class="side-branch-icon-wrapper">
              <div class="side-branch-icon">
              </div>
            </div>
            <font-awesome-icon v-if="node.isFolder" :icon="icon(node.expanded)" />
            <font-awesome-icon v-else :icon="['fa', 'file']" style="padding-left: 10px;"/>
            <div class="name">
                {{node.name}}
            </div>
          </div>
          <font-awesome-icon v-if="node.selected && deletable" @click="$emit('delete-node', node)" class="delete-icon" :icon="['fa', 'trash-alt']"/>
        </div>

        <ul v-if="node.contents" :class='{expanded: node.expanded}' class="folder" >
            <node @delete-node="$emit('delete-node', $event)" @node-clicked="$emit('node-clicked', $event)"
              v-for='node in node.contents' :key='node.name'  :node='node' :deletable='deletable' :highlightHeight='highlightHeight'
              :highlightWidth='highlightWidth' :highlightColor='highlightColor' :hoverHighlightColor="hoverHighlightColor">
            </node>
        </ul>
    </li>
</template>
<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
  name: 'node',
  props: {
    node: { type: Object, required: true },
    deletable: { type: Boolean, required: false },
    highlightWidth: { type: String, required: false },
    highlightHeight: { type: String, required: false },
    highlightColor: { type: String, required: false },
    hoverHighlightColor: { type: String, required: false }
  },
  data: function () {
    return {
      hovered: false
    }
  },
  methods: {
    onClick: function () {
      this.$emit('node-clicked', this.node)
    },
    icon: function (expanded) {
      if (expanded) {
        return ['fa', 'folder-open']
      } else {
        return ['fa', 'folder']
      }
    }
  },
  components: {
    FontAwesomeIcon
  }
}
</script>
<style lang="scss" scoped>
li {
  list-style: none;
  padding-top: 3.5%;
  padding-bottom: 3.5%;
  z-index: 0;
}
.selected{
  background-color: orange;
}
.title-wrapper{
  display: flex;
  flex-direction: row;
}
.node-title{
 display: flex;
 order: 1;
 flex-direction: row;
 justify-content: flex-start;
 align-items: center;
 cursor: pointer;

  .side-branch-icon-wrapper{
    order: 1;
    width: 20px;
    height: 25px;
    .side-branch-icon{
      height: 50%;
      border-bottom: 2px solid black;
      border-left: 2px solid black;
    }
  }
  .name{
    order: 3;
    padding-left: 2.5px;
    padding-right: 2.5px;
  }
  svg{
    order: 2;
    padding-right: 2.5px;
    padding-left: 2.5px;
  }
}
.delete-icon{
    float: right;
    position: relative;
    cursor: pointer;
    width: 30px;
    order: 2;
    right: -10%
  }
.expanded.folder{
  height: fit-content;
}
.folder{
  transition: all 0.3s ease-in-out;
  height: 0px;
  overflow: hidden;
}
.highlight{
  z-index: -1;
  position: absolute;
  left: 0px;
}
.hover-highlight{
  @extend .highlight;
  z-index: -2;
}

</style>
