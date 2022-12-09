
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'
import { httpService } from './http.service.js'
import { socketService } from './socket.service.js'

import { getActionRemoveStation, getActionAddStation, getActionUpdateStation } from '../store/station.store.js'
import { store } from '../store/store'
import axios from 'axios'


const API_KEY = [
  'AIzaSyC-eUmSLJiWa-4c0NO17ogFFVaGMll8ngg',
  'AIzaSyC1Gw-VuraXVtAPlQQbrg8bFrYEwMEPQfA',
  'AIzaSyBVyzOPEOZa2Y4CTbf_JpQhnO5L53IxYjU',
]
let keyIdx = 0
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
  searchSongs,
  updateFollowers
}
window.stationService = stationService






// CRUDL:

// LIST
async function query(filterBy = { txt: '', owner: '' }) {
  // var stations = await storageService.query(STORAGE_KEY)
  // if (filterBy.txt) {
  //   const regex = new RegExp(filterBy.txt, 'i')
  //   stations = stations.filter(station => regex.test(station.name) || regex.test(station.description))
  // }
  // return stations
  const stations = await httpService.get('station', filterBy)
  return stations
}

// READ
function getById(stationId) {
  // return storageService.get(STORAGE_KEY, stationId)
  return httpService.get('station/' + stationId)
  // return axios.get(`/api/station/${stationId}`)
}

// DELETE
async function remove(stationId) {
  await storageService.remove(STORAGE_KEY, stationId)
  return httpService.delete('station/' + stationId)
  // stationChannel.postMessage(getActionRemoveStation(stationId))
}

// UPDATE/CREATE
function save(station) {
  try {
    // socketService.emit('update-station', station)
    console.log('saving:', station)
    return station._id ? _update(station) : _add(station)
  } catch (err) {
    console.log(err);
  }
}

function _update(updatedStation) {
  return httpService.put('station/', updatedStation)
  // return storageService.put(STATION_KEY, updatedStation)
}

function _add(addedStation) {
  console.log('adding:', addedStation)

  const newStation = _createStation(addedStation)
  return httpService.post('station/', newStation)
  // return storageService.post(STATION_KEY, newStation)
}

function _createStation(station) {
  // console.log('creating by:', s)
  return {
    // _id: utilService.makeId(),
    name: station.name,
    owner: { _id: station.owner._id, username: station.owner.username },
    songs: station.songs || [],
    followers: [],
    imgUrl: station.imgUrl || ''
  }
}



// async function save(station) {
//   var savedStation
//   if (station._id) {
//     savedStation = await storageService.put(STORAGE_KEY, station)
//     // stationChannel.postMessage(getActionUpdateStation(savedStation))

//   } else {
//     // Later, owner is set by the backend
//     station.owner = userService.getLoggedinUser() || station.owner
//     savedStation = await storageService.post(STORAGE_KEY, station) //**this is unshifting- pay attention when moving to httpSerice
//     // stationChannel.postMessage(getActionAddStation(savedStation))
//   }
//   return JSON.parse(JSON.stringify(savedStation))
// }

function getEmptyStation() {
  return {
    name: 'My Playlist #' + (Date.now() % 1000),
    imgUrl: '',
    createdAt: Date.now(),
    followers: [],
    songs: [
      // {
      //     id: 's1001',
      //     title: 'The Meters - Cissy Strut',
      //     url: 'youtube/song.mp4',
      //     imgUrl: 'https://i.ytimg.com/vi/4_iC0MyIykM/mqdefault.jpg',
      //     addedBy: '{minimal-user}',
      //     createdAt: Date.now(),
      //     length: '3:07'
      // },
      // {
      //     id: 'mUkfiLjooxs',
      //     title: 'The JB\'s - Pass The Peas',
      //     url: 'youtube/song.mp4',
      //     imgUrl: 'https://i.ytimg.com/vi/mUkfiLjooxs/mqdefault.jpg',
      //     addedBy: {},
      //     createdAt: Date.now(),
      //     length: '3:31'
      // }
    ]
  }
}

async function searchSongs(searchStr) {
  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&videoEmbeddable=true&maxResults=20&type=video&key=${API_KEY[keyIdx]}&q=${searchStr + ' song'}`
    const res = await axios.get(url)
    // console.log('res', res.data.items)
    const songs = await _prepareSongSearchPreviews(res.data.items)
    return songs
  } catch (err) {
    console.log(err)
    ++keyIdx
    if (keyIdx >= API_KEY.length) {
      throw err
    }
    const songs = searchSongs(searchStr)
    if (songs) return songs
  }
}

async function updateFollowers(station, miniUser, isToFollow) {
  station = JSON.parse(JSON.stringify(station))
  station.followers = station.followers ? station.followers : []
  isToFollow ? station.followers.push(miniUser)
    : station.followers = station.followers.filter(user => user._id !== miniUser._id)
  return save(station)
}

async function _prepareSongSearchPreviews(items) {
  const songs = await items.map(async ({ id, snippet }) => {
    let imgUrls = {}
    for (let size in snippet.thumbnails) {
      imgUrls[size] = snippet.thumbnails[size].url
    }
    const songLength = await _getSongLength(id.videoId)

    return {
      id: id.videoId,
      title: utilService.decodeHtmlCharCodes(snippet.title),
      youtubeId: id.videoId,
      imgUrl: imgUrls,
      addedBy: {},
      createdAt: Date.now(),
      length: songLength,
    }
  })
  return Promise.all(songs).then(songs => songs)
}

async function _getSongLength(videoId) {
  const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${API_KEY[keyIdx]}`
  const res = await axios.get(url)
  const data = res.data.items[0].contentDetails.duration
  // data returned: PT3H46M32S
  let hours
  let mins
  let secs
  if (data.includes('H')) {
    hours = data.slice(2, data.indexOf('H'))
    mins = data.slice(data.indexOf('H') + 1, data.indexOf('M'))
    secs = data.slice(data.indexOf('M') + 1, data.indexOf('S'))
  } else if (data.includes('M')) {
    mins = data.slice(2, data.indexOf('M'))
    secs = data.slice(data.indexOf('M') + 1, data.indexOf('S'))
  } else {
    secs = data.slice(2, data.indexOf('S'))
  }
  if (hours) return `${hours}:${mins.padStart(2, 0)}:${secs.padStart(2, 0)}`
  else if (mins) return `${mins}:${secs.padStart(2, 0)}`
  else return `0:${secs.padStart(2, 0)}`
}


import MuseUp from '../demo-data/stations.json' assert {type: 'json'}

if (!localStorage.getItem(STORAGE_KEY) || !localStorage.getItem(STORAGE_KEY).length) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(MuseUp));
}
