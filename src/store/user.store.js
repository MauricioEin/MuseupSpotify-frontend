import { showErrorMsg } from '../services/event-bus.service'
import { userService } from '../services/user.service'
// import { socketService, SOCKET_EMIT_USER_WATCH, SOCKET_EVENT_USER_UPDATED } from '../services/socket.service'

// var localLoggedinUser = null
// if (sessionStorage.user) localLoggedinUser = JSON.parse(sessionStorage.user || null)

export const userStore = {
    state: {
        loggedinUser: null,
        users: [],
        watchedUser: null,
        userStations: null,
    },
    getters: {
        users({ users }) { return users },
        loggedinUser({ loggedinUser }) { return loggedinUser },
        watchedUser({ watchedUser }) { return watchedUser },
        userStations({ userStations }) { return userStations }
    },
    mutations: {
        setLoggedinUser(state, { user }) {
            // Yaron: needed this workaround as for score not reactive from birth
            state.loggedinUser = (user) ? { ...user, stations: [...user.stations], likedSongs: [...user.likedSongs] } : null

        },
        setUserStations(state, { stations }) {
            state.userStations = stations
        },
        updateUserStations(state, { station, isToFollow = false, stationId = '', isUpdate = false }) {
            if (isToFollow) state.userStations.unshift(station)
            else {
                const idx = state.userStations.findIndex(s => s?._id === (station?._id || stationId))
                isUpdate ? state.userStations.splice(idx, 1, station)
                    : state.userStations.splice(idx, 1)
            }
        },
        setWatchedUser(state, { user }) {
            state.watchedUser = user
        },
        setUsers(state, { users }) {
            state.users = users
        },
        removeUser(state, { userId }) {
            state.users = state.users.filter(user => user._id !== userId)
        },

        updateUser(state, { user }) {
            const idx = state.users.findIndex(u => u._id === user._id)
            state.users.splice(idx, 1, user)
        },

        updateUsersStation(state, { editedStation }) {
            const stationIdx = state.loggedinUser.stations.findIndex(station => station._id === editedStation._id)
            if (stationIdx < 0) return
            state.loggedinUser.stations[stationIdx].name = editedStation.name
        },

        updateUserImg(state, { url }) {
            state.loggedinUser.profileImg = url
        },

        removeUserStation(state, { id }) {
            const stationIdx = state.loggedinUser.stations.findIndex(station => station._id === id)
            state.loggedinUser.stations.splice(stationIdx, 1)
        }

    },
    actions: {
        async login({ commit, dispatch }, { userCred }) {
            try {
                const user = await userService.login(userCred)
                commit({ type: 'setLoggedinUser', user })
                dispatch({ type: 'loadUserStations', user })
                return user
            } catch (err) {
                console.log('userStore: Error in login', err)
                throw err
            }
        },
        async signup({ commit }, { userCred }) {
            try {
                const user = await userService.signup(userCred)
                commit({ type: 'setLoggedinUser', user })
                return user
            } catch (err) {
                console.log('userStore: Error in signup', err)
                throw err
            }

        },
        async logout({ commit }) {
            try {
                await userService.logout()
                commit({ type: 'setLoggedinUser', user: null })
            } catch (err) {
                console.log('userStore: Error in logout', err)
                throw err
            }
        },
        async loadUsers({ commit }) {
            // TODO: loading
            try {
                const users = await userService.getUsers()
                commit({ type: 'setUsers', users })
            } catch (err) {
                console.log('userStore: Error in loadUsers', err)
                throw err
            }
        },
        async loadAndWatchUser({ commit }, { userId }) {
            try {
                const user = await userService.getById(userId)
                commit({ type: 'setWatchedUser', user })

            } catch (err) {
                console.log('userStore: Error in loadAndWatchUser', err)
                throw err
            }
        },
        async removeUser({ commit }, { userId }) {
            try {
                await userService.remove(userId)
                commit({ type: 'removeUser', userId })
            } catch (err) {
                console.log('userStore: Error in removeUser', err)
                throw err
            }
        },
        async updateUser({ commit }, { user }) {
            try {
                user = await userService.update(user)
                commit({ type: 'setUser', user })
            } catch (err) {
                console.log('userStore: Error in updateUser', err)
                throw err
            }

        },

        async addStationToLibrary({ commit, state }, { miniStation }) {
            const loggedinUser = JSON.parse(JSON.stringify(state.loggedinUser))
            let savedUser
            if (loggedinUser._id === 'guest')
                savedUser = { ...loggedinUser, stations: [miniStation, ...loggedinUser.stations] }
            else {
                savedUser = await userService.followStation(miniStation, true, loggedinUser)
            }
            commit({ type: 'updateUser', user: savedUser })
            commit({ type: 'setLoggedinUser', user: savedUser })
        },
        async saveSong({ commit, state }, { song }) {
            // optimistic: first update DOM, then update DB
            const user = JSON.parse(JSON.stringify(state.loggedinUser))
            const unsavedUser = JSON.parse(JSON.stringify(user)) // for undoing if err
            const idx = user.likedSongs.findIndex(s => s.id === song.id)
            idx === -1 ? user.likedSongs.unshift({ ...song }) : user.likedSongs.splice(idx, 1)
            commit({ type: 'updateUser', user })
            commit({ type: 'setLoggedinUser', user })
            if (user._id === 'guest') return
            try {
                await userService.update(user)
            } catch (err) {
                console.log(err);
                commit({ type: 'setLoggedinUser', user: unsavedUser })
                commit({ type: 'updateUser', user: unsavedUser })
                showErrorMsg('Log in to like songs')
            }
        },
        async removeUserStation({ commit, state }, { id }) {
            try {
                const loggedinUser = JSON.parse(JSON.stringify(state.loggedinUser))
                const idx = loggedinUser.stations.indexOf(station => station._id === id)
                loggedinUser.stations.splice(idx, 1)
                await userService.update(loggedinUser)
                commit({ type: 'removeUserStation', id })
            } catch (err) {
                console.log(err);
                showErrorMsg('Cannot delete station')
            }
        },
        async loadUserStations({ commit }, { user }) {
            const userStations = user.stations.map(async (currStation) => {
                const station = await stationService.getById(currStation._id)
                return station
            })
            const stations = await Promise.all(userStations)
            commit({ type: 'setUserStations', stations })

        }
    }
}