<template>
    <section class="mini-menu">
        <button @click="queueStation">{{queueAction}}</button>
        <button @click="$emit('follow')">{{ followAction }}</button>
        <button @click="$emit('edit')">Edit details</button>
        <button @click="$emit('remove')">Delete</button>
    </section>
</template>

<script>
export default {
    props: ['isFollowed', 'isQueued'],

    computed: {
        followAction() {
            return this.isFollowed ? 'Unfollow playlist' : 'Follow playlist'
        },
        
        queueAction() {
            return this.isQueued ? 'Remove from queue' : 'Add to queue'
        },

    },
    methods:{
        queueStation(){
            if(this.isQueued){
                this.$emit('removeStationQueue')
            }else{
                this.$emit('queue') 
            } 
        }
    }
}
</script>

