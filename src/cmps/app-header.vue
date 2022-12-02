<template>
  <header ref="header" class="app-header details-layout">
    <div class="flex">
      <nav class="flex">
        <button class="btn-go-back"><btn-go-back /></button>
        <button class="btn-go-next"><btn-go-next /></button>
        <main-search v-if="isOnSearchPage" />
      </nav>
      <section class="loggedin-user" v-if="loggedInUser">
        <router-link :to="`/user/${loggedInUser._id}`">
          {{ loggedInUser.fullname }}
        </router-link>
      </section>
    </div>
  </header>
</template>
<script>
import mainSearch from './main-search.vue';

import btnGoBack from '../assets/svgs/btn-go-back.vue';
import btnGoNext from '../assets/svgs/btn-go-next.vue';

export default {
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedinUser
    },
    isOnSearchPage() {
      return (this.$route.fullPath === '/search')
    }
  },
  components: {
    mainSearch,
    btnGoBack,
    btnGoNext,
  },
  // methods: {
  //   onHeaderObserved(entries) {
  //     entries.forEach((entry) => {
  //       if (entry.isIntersecting) console.log('Scrolled');
  //       // this.isScrolled = entry.isIntersecting ? false : true;
  //     });
  //   },
  // },

  // mounted() {
  //   this.headerObserver = new IntersectionObserver(this.onHeaderObserved, {
  //     rootMargin: "-64px 0px 0px",
  //   });
  //   this.headerObserver.observe(this.$refs.header);
  // },

  // data() {
  //   return {
  //     headerObserver: null,
  //     isScrolled: false,
  //   };
  // },
}
</script>