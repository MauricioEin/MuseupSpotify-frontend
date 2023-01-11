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
        station,
    }
}

export const stationStore = {
    state: {
        stations: [],
        searchedSongs: [],
        playingStation: {
            _id: '', name: 'Morning Energy', songs: [
                { title: 'Coldplay - Universe', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a2/Coldplay_-_My_Universe.png', youtubeId: 'bZYPI4mYwhw' },
                { title: 'Bruno Mars -Talking to the moon', imgUrl: 'https://i.pinimg.com/originals/a1/32/76/a132762c036cb572aa225017df24d842.jpg', youtubeId: 'DeqZkLJYreI' },
                { title: 'Gunz N Roses - Dont Cry', imgUrl: 'https://d1x7zurbps6occ.cloudfront.net/product/xlarge/783278-206345.jpg', youtubeId: '-DPomaw9Sl0' }
            ]
        },
        playingSongIdx: 0,
        currStation: null,
        isPlaying: false,
        filteredStations: {},
        currStationClr: ''
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
        isPlaying(state) {
            return state.isPlaying
        },
        playingSong({ playingStation, playingSongIdx }) {
            return playingStation.songs[playingSongIdx]
        },
        filteredStations(state) { return state.filteredStations },
        stationClr(state) { return state.currStationClr },

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
        playSong(state, { song, stationId = '', stationClr = '#535353' }) {
            const songCopy = { title: song.title, imgUrl: song.imgUrl.medium, youtubeId: song.youtubeId }
            state.playingStation = { _id: stationId, songs: [songCopy], name: '', clr: stationClr }
            state.playingSongIdx = 0
        },
        playStation(state, { station, idx = 0 }) {
            const miniStation = (Array.isArray(station)) ?
                { _id: '', name: '' } : { _id: station._id, name: station.name, clr: station.clr }
            miniStation.songs = station.songs?.map(song => {
                const { title, imgUrl, youtubeId, length, createdAt, id, } = song
                return {
                    title,
                    imgUrl: imgUrl.medium || imgUrl,
                    youtubeId,
                    length, createdAt, id,
                    // isQueued: isQueued || false
                }
            }) || station

            state.playingSongIdx = idx
            state.playingStation = miniStation
        },
        toggleIsPlaying(state) {
            state.isPlaying = !state.isPlaying
        },
        updatePlayingOrder(state, { songs }) {
            const playingSong = state.playingStation.songs[state.playingSongIdx]
            const newIdx = songs.findIndex(s => s.id === playingSong.youtubeId)
            state.playingStation.songs = songs
            state.playingSongIdx = newIdx
        },
        queueSong(state, { song }) {
            state.playingStation.songs.splice(state.playingSongIdx + 1, 0, song)
        },

        queueSong(state, { song }) {
            // song.isQueued = true
            state.playingStation.songs.splice(state.playingSongIdx + 1, 0, song)
        },

        queueStation(state, { station }) {
            var idx = { ...state.playingSongIdx }
            station.forEach(song => {
                // song.isQueued = true
                state.playingStation.songs.splice(idx + 1, 0, song)
                idx++
            })
        },

        removeQueue(state, { item }) {
            if (item?.youtubeId) {
                const idx = state.playingStation.songs.findIndex(s => s.youtubeId === item.youtubeId)
                state.playingStation.songs.splice(idx, 1)
            } else {
                item.forEach(s => {
                    const idx = state.playingStation.songs.findIndex(song => song.youtubeId === s.youtubeId)
                    state.playingStation.songs.splice(idx, 1)
                })
            }
        },
        filterStations(state, { filteredStations }) {
            Object.keys(filteredStations).forEach(key => state.filteredStations[key] = filteredStations[key])

            // state.filteredStations = filteredStations
        },

        addFilteredStation(state, { station }) {
            // console.log(state.filteredStations)
            state.filteredStations.others.unshift(station)
        },
        setStationClr(state, { clr }) {
            state.currStationClr = clr
        },


        // removeAllQueued(state){
        //     state.playingStation.songs.forEach((song, idx)=>{
        //         if(song.isQueued) state.playingStation.songs.splice(idx, 1)
        //     })
        // }
    },
    actions: {
        async filterStations(context, { categories }) {
            const filteredStations = {}

            try {
                const catPrms = categories.map(category => {
                    if (category === 'user') {
                        return stationService.query({ owner: context.getters.loggedinUser._id })
                    }
                    else if (category === 'others') {
                        return stationService.query({ others: context.getters.loggedinUser._id })
                    }
                    else return stationService.query({ category })
                })
                const catStations = await Promise.all(catPrms)
                categories.forEach((cat, idx) => filteredStations[cat] = catStations[idx])

                context.commit({ type: 'filterStations', filteredStations })
            } catch (err) {
                console.log('stationStore: Error in filterStations', err)
                throw err
            }

        },
        async addStation(context, { station }) {
            try {
                const user = { ...context.getters.loggedinUser }
                // station.owner = context.getters.loggedinUser
                // console.log('user:',context.rootState.userStore.loggedinUser)
                station.owner = user
                station = await stationService.save(station)

                context.commit(getActionAddStation(station))
                context.commit({ type: 'updateUserStations', station, isToFollow: true })
                const { name, desc, _id, imgUrl, owner } = station
                context.dispatch({ type: 'addStationToLibrary', miniStation: { _id, name, desc, imgUrl, owner: owner._id } })

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
                if (station.owner._id === context.getters.loggedinUser._id)
                    context.commit({ type: 'updateUserStations', station, isUpdate: true })
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
                context.commit({ type: 'updateUserStations', stationId, isToFollow: false })
                context.dispatch({ type: 'removeUserStation', id: stationId })

            } catch (err) {
                console.log('stationStore: Error in removeStation', err)
                throw err
            }
        },
        async playFromHomePage(context, { station }) {
            try {
                const fullStation = await stationService.getById(station._id)
                context.commit({ type: 'playStation', station: fullStation })

            } catch (err) {
                console.log('stationStore: Error in getting station', err)
                throw err
            }
        },
        async setStationClr(context, { clr, station }) {
            // state.currStationClr = clr
        }


    }
}