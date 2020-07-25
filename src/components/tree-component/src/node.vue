<template>
    <li>
        <i class="fas fa-folder">
        </i>
        <div>
            {{node.name}}
        </div>
        <font-awesome-icon v-if="node.contents!=[]" :icon="icon(node.expanded)" />
        <font-awesome-icon v-else :icon="['fa', 'file']" />
        <ul v-if="node.contents">
            <node v-for='node in node.contents' :key='node.name' :class='{expanded: node.expanded}' :node='node'>
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
</style>
