import Vuex from 'vuex'

import { userStore } from './user.store.js'
import { stationStore } from './station.store.js'
import { userService } from '../services/user.service.js'
import { stationService } from '../services/station.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'

export const store = Vuex.createStore({
  strict: true,
  modules: {
    userStore,
    stationStore
  },
  state: {
  },
  mutations: {
  },
  actions: {
    async followStation({ state, commit }, { station, isToFollow }) {
      // OPTIMISTIC:
      const loggedInUser = JSON.parse(JSON.stringify(state.userStore.loggedinUser))
      console.log('loggedInUser:', loggedInUser)
      const unsavedUser = JSON.parse(JSON.stringify(loggedInUser))
      const miniStation = { _id: station._id, name: station.name }
      isToFollow ? loggedInUser.stations.unshift(miniStation)
        : loggedInUser.stations = loggedInUser.stations.filter(station => station._id !== miniStation._id)
      commit({ type: 'setLoggedinUser', user: loggedInUser })
      if (loggedInUser._id === 'guest') {
        commit({ type: 'updateUser', user: loggedInUser })
        commit({ type: 'updateUserStations', station, isToFollow })

        return
      }


      try {
        const savedUser = await userService.update(loggedInUser)
        console.log('saver user', savedUser)

        const miniUser = {
          _id: loggedInUser._id,
          username: loggedInUser.username,
        }

        const savedStation = await stationService.updateFollowers(station, miniUser, isToFollow)

        commit({ type: 'updateStation', station: savedStation })
        commit({ type: 'updateUser', user: savedUser })
        commit({ type: 'updateUserStations', station, isToFollow })

      } catch (err) {
        console.error('store: Error in following/unfollowing', err)
        commit({ type: 'setLoggedinUser', user: unsavedUser })
        showErrorMsg('Log in to like stations')

        throw err
      }
    },

  }
})
