
<template>
  <div class="simple-page">
    <span>Studio Ghibli Tier List</span>
    <Container orientation="vertical" @drop="onDrop" drag-handle-selector=".column-drag-handle">            
      <Draggable v-for="(item, i) in items" :key="item.id">
        <div  class="draggable-item">
          <span class="column-drag-handle" style="float:left; padding:0 10px;">&#x2630;</span>

           {{i + 1}} -> {{item.data}}
        </div>
      </Draggable>
    </Container>
    <span v-for="item in items">{{item}} || </span>
  </div>
</template>

<script>
import { Container, Draggable } from "vue3-smooth-dnd";
export default {
  name: "app",
  components: { Container, Draggable },
  data() {
    return {
      items: [
        { id: 1, data: "Princess Mononoke" },
        { id: 2, data: "Spirited Away" },
        { id: 3, data: "My Neighbor Totoro" },
        { id: 4, data: "Howl's Moving Castle" }
      ]
    };
  },
  methods: {  
    onDrop(dropResult){
      this.items = this.applyDrag(this.items, dropResult);
    },
    applyDrag(arr, dragResult){
      const { removedIndex, addedIndex, payload } = dragResult;

      if (removedIndex === null && addedIndex === null) return arr;
      const result = [...arr];
      let itemToAdd = payload;
      
      if (removedIndex !== null) {
        itemToAdd = result.splice(removedIndex, 1)[0];
      }
      if (addedIndex !== null) {
        result.splice(addedIndex, 0, itemToAdd);
      }
      return result;
    }
  }
}
</script>



<!-- <template>
  <div class="simple-page">
    VUE SMOOTH
    <Container @drop="onDrop" drag-handle-selector=".column-drag-handle">
      <Draggable v-for="item in items" :key="item.id">
        <div class="draggable-item">
          <span class="column-drag-handle" style="float:left; padding:0 10px;">&#x2630;</span>
          {{item.data}}
        </div>
      </Draggable>
    </Container>
  </div>
</template>

<script>
import { Container, Draggable } from 'vue-smooth-dnd'
// import { applyDrag, generateItems } from '../utils/helpers'
export default {
  name: 'DragHandle',
  components: { Container, Draggable },
  data() {
    return {
      items: this.generateItems(50, i => ({ id: i, data: 'Draggable ' + i }))
    }
  },
  methods: {
    onDrop(dropResult) {
      this.items = this.applyDrag(this.items, dropResult)
    },
    applyDrag(arr, dragResult) {
      const { removedIndex, addedIndex, payload } = dragResult
      if (removedIndex === null && addedIndex === null) return arr

      const result = [...arr]
      let itemToAdd = payload

      if (removedIndex !== null) {
        itemToAdd = result.splice(removedIndex, 1)[0]
      }

      if (addedIndex !== null) {
        result.splice(addedIndex, 0, itemToAdd)
      }

      return result
    },
    generateItems(count, creator) {
      const result = []
      for (let i = 0; i < count; i++) {
        result.push(creator(i))
      }
      return result
    }

  }
}
</script> -->


<!-- <template>
  TEST! VUE-DRAGGABLE
  <draggable v-model="items">
    <template v-slot:item="{ item }">
      example
      <div class="pointer">
        {{ item}}
      </div>
      or your own template
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

</script> -->