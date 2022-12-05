<template>
  TEST! VUE-DRAGGABLE
  <draggable v-model="items">
    <template v-slot:item="{ item }">
      <!-- example -->
      <div class="pointer">
        {{ item}}
      </div>
      <!-- or your own template -->
    </template>
  </draggable>
  Items: 
  <pre>{{items}}</pre>
</template>

<script>
import Draggable from 'vue3-draggable'

export default {
  components: {
    Draggable,
  },
  data() {
    return {
      items: [{ id: 1, title: "Princess Mononoke" },
        { id: 2, title: "Spirited Away" },
        { id: 3, title: "My Neighbor Totoro" },
        { id: 4, title: "Howl's Moving Castle" },
        { id: 5, title: "5 Princess Mononoke" },
        { id: 6, title: "6 Spirited Away" },
        { id: 7, title: "7 My Neighbor Totoro" },
        { id: 8, title: "8 Howl's Moving Castle" }]
    }
  }
}

</script>