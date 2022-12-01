import { createRouter, createWebHashHistory } from 'vue-router'

import home from './views/home.vue'
// import chat from './views/chat.vue'
import carApp from './views/car-app.vue'
import stationApp from './views/station-app.vue'
import reviewApp from './views/review-app.vue'
import loginSignup from './views/login-signup.vue'
import userDetails from './views/user-details.vue'
import stationDetails from './views/station-details.vue'
import mediaPlayer from './cmps/media-player.vue'
import stationSearch from './views/station-search.vue'
import userCollection from './views/user-collection.vue'
import likedSongs from './views/liked-songs.vue'

const routes = [
  {
    path: '/',
    redirect: '/station'  },
  {
    path: '/car',
    name: 'car-app',
    component: carApp
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
    path: '/station/:id',
    name: 'station-details',
    component: stationDetails
  },
  {
    path: '/review',
    name: 'review',
    component: reviewApp
  },
  // {
  //   path: '/chat',
  //   name: 'chat',
  //   component: chat
  // },
  {
    path: '/login',
    name: 'loginSignup',
    component: loginSignup
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
  history: createWebHashHistory()
  // base: process.env.BASE_URL,
})

