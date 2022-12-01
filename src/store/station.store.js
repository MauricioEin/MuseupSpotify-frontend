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
        searchedSongs({ searchedSongs }) { return searchedSongs },
        currStation({ currStation }) { return currStation }
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
    },
    actions: {
        async addStation(context, { station }) {
            try {
                station = await stationService.save(station)
                context.commit(getActionAddStation(station))
                const { name, desc, _id, imgUrl, owner } = station
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