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
        currStation: null
    },
    getters: {
        stations({ stations }) { return stations },
        searchedSongs({ searchedSongs }) { return searchedSongs }
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
            console.log("🚀 ~ file: station.store.js:48 ~ setSearchedSongs ~ searchedSongs", searchedSongs)
        },
        clearMainSearch(state) {
            state.searchedSongs = []
        },
        setCurrStation(state, { station }) {
            state.currStation = station
        },
        clearCurrStation(state) {
            state.currStation = null
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