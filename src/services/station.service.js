
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'
import { getActionRemoveStation, getActionAddStation, getActionUpdateStation } from '../store/station.store.js'
import { store } from '../store/store'

// This file demonstrates how to use a BroadcastChannel to notify other browser tabs 

const STORAGE_KEY = 'station'
// const stationChannel = new BroadcastChannel('stationChannel')


//     ; (() => {
//         stationChannel.addEventListener('message', (ev) => {
//             store.commit(ev.data)
//         })
//     })()

export const stationService = {
    query,
    getById,
    save,
    remove,
    getEmptyStation,
}
window.cs = stationService


async function query(filterBy = { txt: '', price: 0 }) {
    var stations = await storageService.query(STORAGE_KEY)
    if (filterBy.txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        stations = stations.filter(station => regex.test(station.name) || regex.test(station.description))
    }
    // if (filterBy.price) {
    //     stations = stations.filter(station => station.price <= filterBy.price)
    // }
    return stations

}
function getById(stationId) {
    return storageService.get(STORAGE_KEY, stationId)
    // return axios.get(`/api/station/${stationId}`)
}
async function remove(stationId) {
    await storageService.remove(STORAGE_KEY, stationId)
    // stationChannel.postMessage(getActionRemoveStation(stationId))
}
async function save(station) {
    var savedStation
    if (station._id) {
        savedStation = await storageService.put(STORAGE_KEY, station)
        // stationChannel.postMessage(getActionUpdateStation(savedStation))

    } else {
        // Later, owner is set by the backend
        station.owner = userService.getLoggedinUser()
        savedStation = await storageService.post(STORAGE_KEY, station)
        // stationChannel.postMessage(getActionAddStation(savedStation))
    }
    return savedStation
}

function getEmptyStation() {
    return {
        name: 'My Playlist #' + (Date.now() % 1000),
        imgUrl: '',
        createdAt: Date.now(),
        songs: [{
            id: 's1001',
            title: 'The Meters - Cissy Strut',
            url: 'youtube/song.mp4',
            imgUrl: 'https://i.ytimg.com/vi/4_iC0MyIykM/mqdefault.jpg',
            addedBy: '{minimal-user}',
            createdAt: Date.now()
        },
        {
            id: 'mUkfiLjooxs',
            title: 'The JB\'s - Pass The Peas',
            url: 'youtube/song.mp4',
            imgUrl: 'https://i.ytimg.com/vi/mUkfiLjooxs/mqdefault.jpg',
            addedBy: {},
            createdAt: Date.now()
        }]
    }
}


// TEST DATA
// storageService.post(STORAGE_KEY, {name: 'Subali Rahok 2', price: 980}).then(x => console.log(x))




