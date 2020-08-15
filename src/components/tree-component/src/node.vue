<template>
    <li>
        <div class="node-title">
          <font-awesome-icon v-if="node.contents!=[]" :icon="icon(node.expanded)" />
          <font-awesome-icon v-else :icon="['fa', 'file']" />
          <div>
              {{node.name}}
          </div>
        </div>
        <ul v-if="node.contents" :class='{expanded: node.expanded}' >
            <node v-for='node in node.contents' :key='node.name'  :node='node'>
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
<style lang="scss">
li {
  list-style: none;
}
.node-title{
 display: flex;
 flex-direction: row;
 justify-content: flex-start;
 align-items: center;
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
