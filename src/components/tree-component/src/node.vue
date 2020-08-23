<template>
    <li >
        <div @mouseover="$emit('node-hovered', node)" @mouseleave="$emit('hovered-off-node', node)" class="node-title" :id="node.path"  @click="$emit('node-clicked', node)">
          <font-awesome-icon v-if="node.contents.length !== 0" :icon="icon(node.expanded)" />
          <font-awesome-icon v-else :icon="['fa', 'file']" style="padding-left: 10px;"/>
          <div>
              {{node.name}}
          </div>
        </div>
        <ul v-if="node.contents" :class='{expanded: node.expanded}' class="folder" >
            <node @node-hovered="$emit('node-hovered', $event)" @hovered-off-node="$emit('hovered-off-node', $event)" @node-clicked="$emit('node-clicked', $event)"
        @node-deleted="$emit('node-deleted', $event)" v-for='node in node.contents' :key='node.name'  :node='node'>
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
    deletable: { type: Boolean, required: false }
  },
  mounted: function () {
    console.log(this.node)
  },
  methods: {
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
}
.selected{
  background-color: orange;
  // border-radius: 10px;
  // box-shadow: -3px -3px;
}
.node-title{
 display: flex;
 flex-direction: row;
 justify-content: flex-start;
 align-items: center;
  div{
    padding-left: 2.5px;
    padding-right: 2.5px;
  }
  svg{
    padding-right: 2.5px;
    padding-left: 10px;
  }

}
.expanded.folder{
  height: fit-content;
}
.folder{
  transition: all 0.3s ease-in-out;
  height: 0px;
  overflow: hidden;
}
</style>
