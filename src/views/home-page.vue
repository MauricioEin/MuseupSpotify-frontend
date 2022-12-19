<template>
  <section class="landing-page">
    <header class="flex align-center">
      <logo-svg />
      <h2>MuseUp</h2>
    </header>

    <div class="title">
      <h1>Listening is <span>everything.</span></h1>
      <p>Thousands of songs and playlists. No credit card needed.</p>
      <button @click.stop="this.$router.push('/station')" class="btn-get-started">Get started</button>
    </div>

    <img class="desktop-img" src="../assets/img/landing-page-min.png" alt="">
    <img class="mobile-img" src="../assets/img/mobile-landing-image-min.png" alt="">

  </section>


</template>

<script>
import logoSvg from '../assets/svgs/logo-svg.vue';
export default {
  name: 'home',
  data() {
    return {
    }
  },
  computed: {
  },
  mounted() {

  },
  methods: {
  },

  components: {
    logoSvg
  }

}
</script>
