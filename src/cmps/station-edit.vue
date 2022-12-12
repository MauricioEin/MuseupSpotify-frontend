<template>
    <div class="back-screen" @click="$emit('close')">
        <section class="station-edit" @click.stop="">
            <header class="desktop-header">
                <h1>Edit details</h1>
                <button @click="$emit('close')">
                    <x-btn-svg />
                </button>
            </header>

            <header class="mobile-header">
                <button @click="$emit('close')">
                    <x-btn-svg />
                </button>
                <h1>Edit Playlist</h1>
                <button class="save-btn light" @click="save">
                    Save
                </button>
            </header>
            <main>
                <img-uploader :imgSrc="editedStation.imgUrl || altImg" @saved="url => editedStation.imgUrl = url" />
                <div class="title-container">
                    <input type="text" placeholder="Add a name" v-model="editedStation.name">
                </div>
                <div class="desc-container">
                    <textarea v-model="editedStation.desc" :placeholder="descPlaceholder"></textarea>
                </div>
                <div class="save-container">
                    <button @click="save">Save</button>
                </div>
            </main>
        </section>
    </div>
</template>

<script>
import xBtnSvg from '../assets/svgs/x-btn-svg.vue'
import imgUploader from './img-uploader.vue'

export default {
    components: { xBtnSvg, imgUploader },
    props: ['station', 'altImg'],
    data() {
        return {
            editedStation: {
                name: this.station.name,
                desc: this.station.desc,
                imgUrl: this.station.imgUrl,
            },
            isImgHover: false,
            isLoading: false,
        }
    },
    computed: {
        isWide() {
            return window.innerWidth > 860
        },
        descPlaceholder() {
            return this.isWide ? 'Add an optional description'
                : 'Give your playlist a catchy description'
        }
    },
    methods: {
        save() {
            if (!this.editedStation.name) return
            this.$emit('save', { ...this.editedStation })
            this.$emit('close')
        },
    }
}
</script>

