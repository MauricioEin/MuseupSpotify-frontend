<template>
    <div class="back-screen" @click="$emit('close')">
        <section class="station-edit" @click.stop="">
            <header>
                <h1>Edit details</h1>
                <button @click="$emit('close')">
                    <x-btn-svg />
                </button>
            </header>
            <main>
                <div class="img-container"></div>
                <div class="title-container">
                    <input type="text" placeholder="Add a name">
                </div>
                <div class="desc-container">
                    <textarea placeholder="Add an optional description"></textarea>
                </div>
                <div class="save-container">
                    <button>Save</button>
                </div>
            </main>
        </section>
    </div>
</template>

<script>
import xBtnSvg from '../assets/svgs/x-btn-svg.vue';

export default {
    components: { xBtnSvg }
}
</script>

