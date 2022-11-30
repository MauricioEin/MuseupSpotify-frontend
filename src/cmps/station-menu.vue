<template>
    <section class="station-menu" @click="">
        <button>Add to queue</button>
        <button>Add to profile</button>
        <button>Edit details</button>
        <button @click="removeStation">Delete</button>
    </section>
</template>

<script>
export default {
    methods: {
        removeStation() {
            this.$emit('removeStation')
        }
    }
}
</script>

<style lang="scss">
.station-menu {

    // TODO change to var
    background-color: #282828;
    padding: 5px;
    position: absolute;
    display: flex;
    // display: none;
    box-shadow: 0 16px 24px rgb(0 0 0 / 30%), 0 6px 8px rgb(0 0 0 / 20%);
    flex-direction: column;
    transform: translate(0, 20%);
    width: 150px;
    top: 0;
    align-items: flex-start;
    border-radius: 5px;

    hr {
        width: 90%;
        //TODO change to var
        background-color: #3e3e3e;
        size: 5px;
    }

    button {
        background-color: unset;
        height: 40px;
        margin: 0;
        padding: 10px;
        width: 100%;
        text-align: start;


        &:hover {
            //TODO change to var
            background-color: #3e3e3e;
        }
    }
}
</style>