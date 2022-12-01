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
        playingStation: [{title:'Coldplay - Universe', imgUrl:'https://upload.wikimedia.org/wikipedia/en/a/a2/Coldplay_-_My_Universe.png', youtubueId: 'nukZQTFsA10'}],
    },
    getters: {
        stations({ stations }) { return stations },
        searchedSongs({ searchedSongs }) { return searchedSongs },
        getPlayingStation(state){
            return state.playingStation
        }
    },
    mutations: {
        setStations(state, { stations }) {
            state.stations = stations
        },
        addStation(state, { station }) {
            state.stations.push(station)
        },
        updateStation(state, { station }) {
            const idx = state.stations.findIndex(s => s._id === station._id)
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
        }
    },
    actions: {
        async addStation(context, { station }) {
            try {
                station = await stationService.save(station)
                context.commit(getActionAddStation(station))
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