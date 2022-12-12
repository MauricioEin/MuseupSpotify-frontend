<template>
    <div class="search-category-card">
        <h1>{{ label }}</h1>
        <div class="img-container">
            <img :src="getImgSrc(imgIdx)">
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
        },
        imgSrc: {
            type: String
        }
    },

    methods: {
        getImgSrc(i) {
            return `../assets/img/categories/${i}.jpg`
        }
    }
}

</script>
