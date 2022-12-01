<template>
    <div class="img-uploader-container" @mouseenter="isImgHover = true" @mouseleave="isImgHover = false">
        <img v-if="imgSrc" :src="imgSrc" class="fit-img" />
        <div v-else v-if="!isImgHover" class="alt-img flex justify-center align-center">
            <music-note-svg />
        </div>
        <label class="img-uploader">
            <div v-if="isImgHover" class="img-change-cover flex justify-center align-center text-center">
                <div>
                    <pencil-svg />
                    <h4 class="light">Choose photo</h4>
                </div>
            </div>
            <input hidden type="file" accept="image/.jpg, image/.jpeg, image/.png" @change="handleFile" />
        </label>
    </div>
</template>

<script>

import pencilSvg from '../assets/svgs/pencil-svg.vue'
import musicNoteSvg from '../assets/svgs/music-note-svg.vue'
import { uploadImg } from '../services/upload.service.js'


export default {
    components: { pencilSvg, musicNoteSvg },
    props: ['imgSrc'],
    data() {
        return {
            isImgHover: false
        }
    },
    methods: {
        handleFile(ev) {
            console.log('ev', ev)
            let file
            if (ev.type === 'change') file = ev.target.files[0]
            console.log('file', file)
            this.onUploadFile(file)
        },
        async onUploadFile(file) {
            // this.isLoading = true
            console.log('loading...')
            try {
                const res = await uploadImg(file)
                console.log('res.url', res.url)
                // this.editedStation.imgUrl = res.url
                this.$emit('saved', res.url)
            } catch (err) {
                console.log('COULDNT UPDATE IMG')
                console.dir(err)
                throw err
            } finally {
                // this.isLoading = false
            }
        },

    }
}
</script>

