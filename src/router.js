import { createRouter, createWebHashHistory } from 'vue-router'

import homePage from './views/home-page.vue'
import stationApp from './views/station-app.vue'
import userDetails from './views/user-details.vue'
import stationDetails from './views/station-details.vue'
import mediaPlayer from './cmps/media-player.vue'
import stationSearch from './views/station-search.vue'
import userCollection from './views/user-library.vue'
import likedSongs from './views/liked-songs.vue'
import signup from './views/signup.vue'
import login from './views/login.vue'
import stationLibrary from './views/station-library.vue'


import testDnd from './views/test-dnd.vue'

const routes = [
  {
    path: '/',
    // redirect: '/station'
    name: 'home-page',
    component: homePage
  },
  {
    path: '/dnd',
    name: 'test-dnd',
    component: testDnd
  }, {
    path: '/station',
    name: 'station-app',
    component: stationApp
  },
  {
    path: '/search',
    name: 'station-search',
    component: stationSearch
  },
  {
    path: '/collection',
    name: 'user-collection',
    component: userCollection
  },
  {
    path: '/collection/tracks',
    name: 'liked-songs',
    component: likedSongs
  },
  {
    path: '/collection/all',
    name: 'station-library',
    component: stationLibrary
  },
  {
    path: '/station/:id',
    name: 'station-details',
    component: stationDetails
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/signup',
    name: 'signup',
    component: signup
  },
  {
    path: '/user/:id',
    name: 'user-details',
    component: userDetails
  },
  {
    path: '/player',
    name: 'media-player',
    component: mediaPlayer
  }
]


export const router = createRouter({
  routes,
  history: createWebHashHistory(),
  scrollBehavior(to, from, savedPosition) {
    return { top: 0, behavior: 'smooth' }
  }
  // base: process.env.BASE_URL,
})

