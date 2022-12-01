import Vuex from 'vuex'

import { userStore } from './user.store.js'
import { carStore } from './car.store.js'
import { stationStore } from './station.store.js'
import { reviewStore } from './review.store.js'
import { userService } from '../services/user.service.js'
import { stationService } from '../services/station.service.js'

export const store = Vuex.createStore({
  strict: true,
  modules: {
    userStore,
    carStore,
    reviewStore,
    stationStore
  },
  state: {
  },
  mutations: {
  },
  actions: {
    async followStation({ state, commit }, { station, isToFollow }) {
      try {
        const miniUser = {
          _id: state.userStore.loggedinUser._id,
          username: state.userStore.loggedinUser.username
        }
        const miniStation = {
          _id: station._id,
          name: station.name
        }
        const savedStation = await stationService.updateFollowers(station, miniUser, isToFollow)
        const savedUser = await userService.followStation(miniStation, isToFollow)
        commit({ type: 'updateStation', station: savedStation })
        commit({ type: 'updateUser', user: savedUser })
        commit({ type: 'setLoggedinUser', user: savedUser })
      } catch (err) {
        console.error('store: Error in following/unfollowing', err)
        throw err
      }
    },

  }
})
