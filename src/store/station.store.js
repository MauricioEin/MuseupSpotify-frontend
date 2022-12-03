import { stationService } from '../services/station.service'

export function getActionRemoveStation(stationId) {
    return {
        type: 'removeStation',
        stationId
    }
}
export function getActionAddStation(station) {
    return {
        type: 'addStation',
        station
    }
}
export function getActionUpdateStation(station) {
    return {
        type: 'updateStation',
        station
    }
}

export const stationStore = {
    state: {
        stations: [],
        searchedSongs: [],
        playingStation: [
            { title: 'Coldplay - Universe', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a2/Coldplay_-_My_Universe.png', youtubeId: 'bZYPI4mYwhw' },
            { title: 'Bruno Mars -Talking to the moon', imgUrl: 'https://i.pinimg.com/originals/a1/32/76/a132762c036cb572aa225017df24d842.jpg', youtubeId: 'DeqZkLJYreI' },
            { title: 'Gunz N Roses - Dont Cry', imgUrl: 'https://d1x7zurbps6occ.cloudfront.net/product/xlarge/783278-206345.jpg', youtubeId: '-DPomaw9Sl0' }
        ],
        playingSongIdx: 0,
        currStation: null,
        isPlayed: false
    },
    getters: {
        stations({ stations }) { return stations },
        searchedSongs({ searchedSongs }) { return searchedSongs },
        getPlayingStation(state) {
            return state.playingStation
        },
        getPlayingSongIdx(state) {
            return state.playingSongIdx
        },
        currStation({ currStation }) { return currStation },
        isPlayed(state) {
            return state.isPlayed
        },
        playingSong({playingStation, playingSongIdx}){
            return playingStation[playingSongIdx]
        }
    },
    mutations: {
        setStations(state, { stations }) {
            state.stations = stations
        },
        addStation(state, { station }) {
            state.stations.unshift(station)
        },
        updateStation(state, { station }) {
            const idx = state.stations.findIndex(s => s._id === station._id)
            console.log('idx:', idx)
            console.log('station:', station)
            console.log('stations:', state.stations)
            // state.stations[idx]=station
            state.stations.splice(idx, 1, station)
        },
        removeStation(state, { stationId }) {
            state.stations = state.stations.filter(station => station._id !== stationId)
        },
        setSearchedSongs(state, { searchedSongs }) {
            state.searchedSongs = searchedSongs
        },
        clearMainSearch(state) {
            state.searchedSongs = []
        },
        setCurrStation(state, { station }) {
            state.currStation = station
        },
        clearCurrStation(state) {
            state.currStation = null
        },
        playSong(state, { song }) {
            const songCopy = { title: song.title, imgUrl: song.imgUrl.medium, youtubeId: song.youtubeId }
            state.playingStation = [songCopy]
            state.playingSongIdx = 0
        },
        playStation(state, { station }) {
            console.log(station);
            const miniStation = station.songs.map(song => {
                const { title, imgUrl, youtubeId } = song
                return {
                    title,
                    imgUrl: imgUrl.medium,
                    youtubeId,
                }
            })
            state.playingStation = miniStation
            state.playingSongIdx = 0
            // commit('toggleIsPlayed')
            // state.isPlayed = !state.isPlayed
            // console.log(state.isPlayed);
        },
        toggleIsPlayed(state) {
            state.isPlayed = !state.isPlayed
            console.log(state.isPlayed);
            console.log('Is played?',state.isPlayed)
        }
    },
    actions: {
        async addStation(context, { station }) {
            try {
                const user = { ...context.getters.loggedinUser }
                // station.owner = context.getters.loggedinUser
                // console.log('user:',context.rootState.userStore.loggedinUser)
                station.owner = user
                console.log('station', station)
                station = await stationService.save(station)

                context.commit(getActionAddStation(station))
                const { name, desc, _id, imgUrl, owner } = station
                console.log('owner:', owner)
                context.dispatch({ type: 'addStationToLibrary', miniStation: { _id, name, desc, imgUrl, owner: owner.username } })

                return station
            } catch (err) {
                console.log('stationStore: Error in addStation', err)
                throw err
            }
        },
        async updateStation(context, { station }) {
            try {
                station = await stationService.save(station)
                context.commit(getActionUpdateStation(station))
                return station
            } catch (err) {
                console.log('stationStore: Error in updateStation', err)
                throw err
            }
        },
        async loadStations(context) {
            try {
                const stations = await stationService.query()
                context.commit({ type: 'setStations', stations })
            } catch (err) {
                console.log('stationStore: Error in loadStations', err)
                throw err
            }
        },
        async removeStation(context, { stationId }) {
            try {
                await stationService.remove(stationId)
                context.commit(getActionRemoveStation(stationId))
            } catch (err) {
                console.log('stationStore: Error in removeStation', err)
                throw err
            }
        },
    }
}