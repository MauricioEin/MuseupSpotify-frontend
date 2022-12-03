<template>
    ISMINIMENU? {{ isMiniMenu }}
    <li class="song-preview" @click="isClicked = !isClicked" :class="{ clicked: isClicked }">
        <!-- <div class="song-preview-info"> -->
        <div class="song-index">{{ index + 1 }}</div>
        <div class="song-img-container">
            <img :src="imgUrl" alt="">
        </div>
        <div class="song-title">{{ song.title }}</div>
        <!-- </div> -->
        <div class="song-created-at">{{ dateAdded }}</div>
        <div class="song-preview-actions">
            <button class="btn-like-song">
                <heart-empty-svg />
            </button>
            <div class="song-length">{{ song.length }}
                <mini-menu v-if="isMiniMenu"
                    :actions="['Add to queue', 'Save to your Liked Songs', 'Add to playlist', 'Share']" />

            </div>
            <button class="btn-more-options" @click.stop="isClicked = !isClicked;toggleMiniMenu()">
                <more-options-svg />
            </button>
        </div>
    </li>


</template>

<script>
import heartEmptySvg from '../assets/svgs/heart-empty-svg.vue'
import moreOptionsSvg from '../assets/svgs/more-options-svg.vue'
import miniMenu from '../cmps/mini-menu.vue'


export default {
    props: {
        song: {
            type: Object
        },
        index: {
            type: Number
        }
    },
    data() {
        return {
            isMiniMenu: false,
            isClicked: false,
        }
    },
    created(){
        window.addEventListener('click', () => this.isMiniMenu = false);

    },
    computed: {
        dateAdded() {
            const d = new Date(this.song.createdAt)
            return d.toLocaleDateString('he-IL')
        },
        imgUrl() {
            return this.song.imgUrl.medium || this.song.imgUrl
        }
    }, methods: {
        toggleMiniMenu() {
            this.isMiniMenu = !this.isMiniMenu
        },

    },
    components: {
        heartEmptySvg,
        moreOptionsSvg,
        miniMenu
    }
}

</script>

<style lang="scss" scoped>

</style>