<template>
    <div class="img-uploader-container" @mouseenter="isImgHover = true" @mouseleave="isImgHover = false">
        <img v-if="imgSrc" :src="imgSrc" class="fit-img" />
        <div v-else v-if="!(isImgHover&&!isLoading)" class="alt-img flex justify-center align-center">
            <music-note-svg />
        </div>
        <div v-if="isLoading" class="loader-container fit-img">
            <loader-svg />
        </div>
        <label class="img-uploader">
            <div v-if="isImgHover && !isLoading" class="img-change-cover flex justify-center align-center text-center">
                <div>
                    <pencil-svg />
                    <h4 class="light">Choose photo</h4>
                </div>
            </div>
            <input hidden type="file" accept="image/.jpg, image/.jpeg, image/.png" @change="handleFile" />
            <p class="subForMobile">Change image</p>
        </label>
    </div>
</template>

<script>

import pencilSvg from '../assets/svgs/pencil-svg.vue'
import musicNoteSvg from '../assets/svgs/music-note-svg.vue'
import loaderSvg from '../assets/svgs/loader-svg.vue'

import { uploadImg } from '../services/upload.service.js'


export default {
    components: { pencilSvg, musicNoteSvg, loaderSvg },
    props: ['imgSrc'],
    data() {
        return {
            isImgHover: false,
            isLoading: false
        }
    },
    methods: {
        handleFile(ev) {
            let file
            if (ev.type === 'change') file = ev.target.files[0]
            this.onUploadFile(file)
        },
        async onUploadFile(file) {
            this.isLoading = true
            console.log('loading...')
            try {
                const res = await uploadImg(file)
                console.log('res.url', res.url)
                // this.editedStation.imgUrl = res.url
                this.$emit('saved', res.url)
            } catch (err) {
                console.dir(err)
                throw err
            } finally {
                this.isLoading = false
            }
        },

    }
}
</script>

