<template>
    <div class="search-category-card">
        <h1>{{ label }}</h1>
        <div class="img-container">
            <img :src="imgSrc" :title="imgSrc">
        </div>
    </div>
</template>

<script>
export default {
    props: {
        label: {
            type: String
        },
        imgIdx: {
            type: Number
        }
    },

    computed: {
        imgSrc() {
            return `../assets/img/categories/${this.imgIdx}.jpg`
        }
    }
}

</script>
