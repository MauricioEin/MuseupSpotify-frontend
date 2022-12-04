
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'
import { getActionRemoveStation, getActionAddStation, getActionUpdateStation } from '../store/station.store.js'
import {store} from '../store/store'
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
        station.owner = userService.getLoggedinUser()||station.owner
        savedStation = await storageService.post(STORAGE_KEY, station) //**this is unshifting- pay attention when moving to httpSerice
        // stationChannel.postMessage(getActionAddStation(savedStation))
    }
    return JSON.parse(JSON.stringify(savedStation))
}

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
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&videoEmbeddable=true&maxResults=5&type=video&key=${API_KEY[keyIdx]}&q=${searchStr + ' song'}`
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
    station=JSON.parse(JSON.stringify(station))
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
        // console.log("🚀 ~ file: station.service.js:119 ~ returnitems.map ~ songLength", songLength)
        // console.log(_getSongLength(id.videoId))

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
    if (data.includes('H')) {
        hours = data.slice(2, data.indexOf('H'))
        mins = data.slice(data.indexOf('H') + 1, data.indexOf('M'))
    } else {
        mins = data.slice(2, data.indexOf('M'))
    }
    const secs = data.slice(data.indexOf('M') + 1, data.indexOf('S'))
    if (hours) return `${hours}:${mins.padStart(2, 0)}:${secs.padStart(2, 0)}`
    else return `${mins}:${secs.padStart(2, 0)}`
}


// var demo1 = 
//         {
//           "name": "90's Hip Hop",
//           "songs": [
//             {
//               "id": "41qC3w3UUkU",
//               "title": "2Pac - Hit 'Em Up (Dirty) (Music Video) HD",
//               "youtubeId": "41qC3w3UUkU",
//               "imgUrl": {
//                 "default": "https://i.ytimg.com/vi/41qC3w3UUkU/default.jpg",
//                 "medium": "https://i.ytimg.com/vi/41qC3w3UUkU/mqdefault.jpg",
//                 "high": "https://i.ytimg.com/vi/41qC3w3UUkU/hqdefault.jpg"
//               },
//               "addedBy": {},
//               "createdAt": 1670159732093,
//               "length": "5:23"
//             },
//             {
//               "id": "Mb1ZvUDvLDY",
//               "title": "2Pac - Dear Mama",
//               "youtubeId": "Mb1ZvUDvLDY",
//               "imgUrl": {
//                 "default": "https://i.ytimg.com/vi/Mb1ZvUDvLDY/default.jpg",
//                 "medium": "https://i.ytimg.com/vi/Mb1ZvUDvLDY/mqdefault.jpg",
//                 "high": "https://i.ytimg.com/vi/Mb1ZvUDvLDY/hqdefault.jpg"
//               },
//               "addedBy": {},
//               "createdAt": 1670159732108,
//               "length": "4:36"
//             },
//             {
//               "id": "eXvBjCO19QY",
//               "title": "2Pac - Changes ft. Talent",
//               "youtubeId": "eXvBjCO19QY",
//               "imgUrl": {
//                 "default": "https://i.ytimg.com/vi/eXvBjCO19QY/default.jpg",
//                 "medium": "https://i.ytimg.com/vi/eXvBjCO19QY/mqdefault.jpg",
//                 "high": "https://i.ytimg.com/vi/eXvBjCO19QY/hqdefault.jpg"
//               },
//               "addedBy": {},
//               "createdAt": 1670159732115,
//               "length": "4:31"
//             },
//             {
//               "id": "_JZom_gVfuw",
//               "title": "The Notorious B.I.G. - Juicy (Official Video) [4K]",
//               "youtubeId": "_JZom_gVfuw",
//               "imgUrl": {
//                 "default": "https://i.ytimg.com/vi/_JZom_gVfuw/default.jpg",
//                 "medium": "https://i.ytimg.com/vi/_JZom_gVfuw/mqdefault.jpg",
//                 "high": "https://i.ytimg.com/vi/_JZom_gVfuw/hqdefault.jpg"
//               },
//               "addedBy": {},
//               "createdAt": 1670159745514,
//               "length": "4:13"
//             },
//             {
//               "id": "TbSm6HsX_ek",
//               "title": "The Notorious B.I.G. - Warning (Official Music Video) [HD]",
//               "youtubeId": "TbSm6HsX_ek",
//               "imgUrl": {
//                 "default": "https://i.ytimg.com/vi/TbSm6HsX_ek/default.jpg",
//                 "medium": "https://i.ytimg.com/vi/TbSm6HsX_ek/mqdefault.jpg",
//                 "high": "https://i.ytimg.com/vi/TbSm6HsX_ek/hqdefault.jpg"
//               },
//               "addedBy": {},
//               "createdAt": 1670159745500,
//               "length": "3:32"
//             },
//             {
//               "id": "phaJXp_zMYM",
//               "title": "The Notorious B.I.G. - Big Poppa (Official Music Video) [HD]",
//               "youtubeId": "phaJXp_zMYM",
//               "imgUrl": {
//                 "default": "https://i.ytimg.com/vi/phaJXp_zMYM/default.jpg",
//                 "medium": "https://i.ytimg.com/vi/phaJXp_zMYM/mqdefault.jpg",
//                 "high": "https://i.ytimg.com/vi/phaJXp_zMYM/hqdefault.jpg"
//               },
//               "addedBy": {},
//               "createdAt": 1670159745505,
//               "length": "4:22"
//             }
//           ],
//           "followers": [],
//           "owner": {
//             "username": "ilan",
//             "password": "123",
//             "fullname": "ilan",
//             "stations": [
//               {
//                 "_id": "SkAsV",
//                 "name": "This Is JuiceWRLD",
//                 "owner": "ilan"
//               },
//               {
//                 "_id": "TNm4g",
//                 "name": "הלהיטים הגדולים של ישראל",
//                 "owner": "ilan"
//               }
//             ],
//             "likedSongs": [],
//             "_id": "kiH1V"
//           },
//           "_id": "nxB4r",
//           "imgUrl": "http://res.cloudinary.com/casep22/image/upload/v1670159560/90s_ffhu6w.jpg"
//         }

var demo = [
    {
      "name": "Pop Mix",
      "songs": [
        {
          "id": "dI3xkL7qUAc",
          "title": "Doja Cat - Need to Know (Official Video)",
          "youtubeId": "dI3xkL7qUAc",
          "imgUrl": {
            "default": "https://i.ytimg.com/vi/dI3xkL7qUAc/default.jpg",
            "medium": "https://i.ytimg.com/vi/dI3xkL7qUAc/mqdefault.jpg",
            "high": "https://i.ytimg.com/vi/dI3xkL7qUAc/hqdefault.jpg"
          },
          "addedBy": {},
          "createdAt": 1670160089019,
          "length": "3:40"
        },
        {
          "id": "_VuJA-VQRcY",
          "title": "Central Cee - Doja (Directed by Cole Bennett)",
          "youtubeId": "_VuJA-VQRcY",
          "imgUrl": {
            "default": "https://i.ytimg.com/vi/_VuJA-VQRcY/default.jpg",
            "medium": "https://i.ytimg.com/vi/_VuJA-VQRcY/mqdefault.jpg",
            "high": "https://i.ytimg.com/vi/_VuJA-VQRcY/hqdefault.jpg"
          },
          "addedBy": {},
          "createdAt": 1670160088996,
          "length": "1:46"
        },
        {
          "id": "x3bfa3DZ8JM",
          "title": "Khalid - Better (Official Video)",
          "youtubeId": "x3bfa3DZ8JM",
          "imgUrl": {
            "default": "https://i.ytimg.com/vi/x3bfa3DZ8JM/default.jpg",
            "medium": "https://i.ytimg.com/vi/x3bfa3DZ8JM/mqdefault.jpg",
            "high": "https://i.ytimg.com/vi/x3bfa3DZ8JM/hqdefault.jpg"
          },
          "addedBy": {},
          "createdAt": 1670160101598,
          "length": "4:11"
        }
      ],
      "followers": [],
      "owner": {
        "username": "ilan",
        "password": "123",
        "fullname": "ilan",
        "stations": [
          {
            "_id": "SkAsV",
            "name": "This Is JuiceWRLD",
            "owner": "ilan"
          },
          {
            "_id": "TNm4g",
            "name": "הלהיטים הגדולים של ישראל",
            "owner": "ilan"
          },
          {
            "_id": "nxB4r",
            "name": "90's Hip Hop",
            "owner": "ilan"
          },
          {
            "_id": "dkGpG",
            "name": "Rock This",
            "owner": "ilan"
          }
        ],
        "likedSongs": [],
        "_id": "kiH1V"
      },
      "_id": "azGoq",
      "imgUrl": "http://res.cloudinary.com/casep22/image/upload/v1670160072/pop_m9arlo.jpg"
    },
    {
      "name": "Rock This",
      "songs": [
        {
          "id": "1w7OgIMMRc4",
          "title": "Guns N' Roses - Sweet Child O' Mine (Official Music Video)",
          "youtubeId": "1w7OgIMMRc4",
          "imgUrl": {
            "default": "https://i.ytimg.com/vi/1w7OgIMMRc4/default.jpg",
            "medium": "https://i.ytimg.com/vi/1w7OgIMMRc4/mqdefault.jpg",
            "high": "https://i.ytimg.com/vi/1w7OgIMMRc4/hqdefault.jpg"
          },
          "addedBy": {},
          "createdAt": 1670159883357,
          "length": "5:03"
        },
        {
          "id": "8SbUC-UaAxE",
          "title": "Guns N' Roses - November Rain",
          "youtubeId": "8SbUC-UaAxE",
          "imgUrl": {
            "default": "https://i.ytimg.com/vi/8SbUC-UaAxE/default.jpg",
            "medium": "https://i.ytimg.com/vi/8SbUC-UaAxE/mqdefault.jpg",
            "high": "https://i.ytimg.com/vi/8SbUC-UaAxE/hqdefault.jpg"
          },
          "addedBy": {},
          "createdAt": 1670159883368,
          "length": "9:17"
        },
        {
          "id": "o1tj2zJ2Wvg",
          "title": "Guns N' Roses - Welcome To The Jungle",
          "youtubeId": "o1tj2zJ2Wvg",
          "imgUrl": {
            "default": "https://i.ytimg.com/vi/o1tj2zJ2Wvg/default.jpg",
            "medium": "https://i.ytimg.com/vi/o1tj2zJ2Wvg/mqdefault.jpg",
            "high": "https://i.ytimg.com/vi/o1tj2zJ2Wvg/hqdefault.jpg"
          },
          "addedBy": {},
          "createdAt": 1670159883372,
          "length": "4:40"
        },
        {
          "id": "zRIbf6JqkNc",
          "title": "Guns N' Roses - Don't Cry",
          "youtubeId": "zRIbf6JqkNc",
          "imgUrl": {
            "default": "https://i.ytimg.com/vi/zRIbf6JqkNc/default.jpg",
            "medium": "https://i.ytimg.com/vi/zRIbf6JqkNc/mqdefault.jpg",
            "high": "https://i.ytimg.com/vi/zRIbf6JqkNc/hqdefault.jpg"
          },
          "addedBy": {},
          "createdAt": 1670159883361,
          "length": "5:14"
        }
      ],
      "followers": [],
      "owner": {
        "username": "ilan",
        "password": "123",
        "fullname": "ilan",
        "stations": [
          {
            "_id": "SkAsV",
            "name": "This Is JuiceWRLD",
            "owner": "ilan"
          },
          {
            "_id": "TNm4g",
            "name": "הלהיטים הגדולים של ישראל",
            "owner": "ilan"
          },
          {
            "_id": "nxB4r",
            "name": "90's Hip Hop",
            "owner": "ilan"
          }
        ],
        "likedSongs": [],
        "_id": "kiH1V"
      },
      "_id": "dkGpG",
      "imgUrl": "http://res.cloudinary.com/casep22/image/upload/v1670159870/rock_d83acp.jpg"
    },
    {
      "name": "90's Hip Hop",
      "songs": [
        {
          "id": "41qC3w3UUkU",
          "title": "2Pac - Hit 'Em Up (Dirty) (Music Video) HD",
          "youtubeId": "41qC3w3UUkU",
          "imgUrl": {
            "default": "https://i.ytimg.com/vi/41qC3w3UUkU/default.jpg",
            "medium": "https://i.ytimg.com/vi/41qC3w3UUkU/mqdefault.jpg",
            "high": "https://i.ytimg.com/vi/41qC3w3UUkU/hqdefault.jpg"
          },
          "addedBy": {},
          "createdAt": 1670159732093,
          "length": "5:23"
        },
        {
          "id": "Mb1ZvUDvLDY",
          "title": "2Pac - Dear Mama",
          "youtubeId": "Mb1ZvUDvLDY",
          "imgUrl": {
            "default": "https://i.ytimg.com/vi/Mb1ZvUDvLDY/default.jpg",
            "medium": "https://i.ytimg.com/vi/Mb1ZvUDvLDY/mqdefault.jpg",
            "high": "https://i.ytimg.com/vi/Mb1ZvUDvLDY/hqdefault.jpg"
          },
          "addedBy": {},
          "createdAt": 1670159732108,
          "length": "4:36"
        },
        {
          "id": "eXvBjCO19QY",
          "title": "2Pac - Changes ft. Talent",
          "youtubeId": "eXvBjCO19QY",
          "imgUrl": {
            "default": "https://i.ytimg.com/vi/eXvBjCO19QY/default.jpg",
            "medium": "https://i.ytimg.com/vi/eXvBjCO19QY/mqdefault.jpg",
            "high": "https://i.ytimg.com/vi/eXvBjCO19QY/hqdefault.jpg"
          },
          "addedBy": {},
          "createdAt": 1670159732115,
          "length": "4:31"
        },
        {
          "id": "_JZom_gVfuw",
          "title": "The Notorious B.I.G. - Juicy (Official Video) [4K]",
          "youtubeId": "_JZom_gVfuw",
          "imgUrl": {
            "default": "https://i.ytimg.com/vi/_JZom_gVfuw/default.jpg",
            "medium": "https://i.ytimg.com/vi/_JZom_gVfuw/mqdefault.jpg",
            "high": "https://i.ytimg.com/vi/_JZom_gVfuw/hqdefault.jpg"
          },
          "addedBy": {},
          "createdAt": 1670159745514,
          "length": "4:13"
        },
        {
          "id": "TbSm6HsX_ek",
          "title": "The Notorious B.I.G. - Warning (Official Music Video) [HD]",
          "youtubeId": "TbSm6HsX_ek",
          "imgUrl": {
            "default": "https://i.ytimg.com/vi/TbSm6HsX_ek/default.jpg",
            "medium": "https://i.ytimg.com/vi/TbSm6HsX_ek/mqdefault.jpg",
            "high": "https://i.ytimg.com/vi/TbSm6HsX_ek/hqdefault.jpg"
          },
          "addedBy": {},
          "createdAt": 1670159745500,
          "length": "3:32"
        },
        {
          "id": "phaJXp_zMYM",
          "title": "The Notorious B.I.G. - Big Poppa (Official Music Video) [HD]",
          "youtubeId": "phaJXp_zMYM",
          "imgUrl": {
            "default": "https://i.ytimg.com/vi/phaJXp_zMYM/default.jpg",
            "medium": "https://i.ytimg.com/vi/phaJXp_zMYM/mqdefault.jpg",
            "high": "https://i.ytimg.com/vi/phaJXp_zMYM/hqdefault.jpg"
          },
          "addedBy": {},
          "createdAt": 1670159745505,
          "length": "4:22"
        }
      ],
      "followers": [],
      "owner": {
        "username": "ilan",
        "password": "123",
        "fullname": "ilan",
        "stations": [
          {
            "_id": "SkAsV",
            "name": "This Is JuiceWRLD",
            "owner": "ilan"
          },
          {
            "_id": "TNm4g",
            "name": "הלהיטים הגדולים של ישראל",
            "owner": "ilan"
          }
        ],
        "likedSongs": [],
        "_id": "kiH1V"
      },
      "_id": "nxB4r",
      "imgUrl": "http://res.cloudinary.com/casep22/image/upload/v1670159560/90s_ffhu6w.jpg"
    },
    {
      "name": "הלהיטים הגדולים של ישראל",
      "songs": [
        {
          "id": "qEEzKfGa1oY",
          "title": "עדן בן זקן - חיים שלי | Eden Ben Zaken - Haim Sheli",
          "youtubeId": "qEEzKfGa1oY",
          "imgUrl": {
            "default": "https://i.ytimg.com/vi/qEEzKfGa1oY/default.jpg",
            "medium": "https://i.ytimg.com/vi/qEEzKfGa1oY/mqdefault.jpg",
            "high": "https://i.ytimg.com/vi/qEEzKfGa1oY/hqdefault.jpg"
          },
          "addedBy": {},
          "createdAt": 1670159663654,
          "length": "4:23"
        },
        {
          "id": "5gJkRXxFkcM",
          "title": "עדן חסון - עד שתבואי עד אליי (Prod. by Stav Beger)",
          "youtubeId": "5gJkRXxFkcM",
          "imgUrl": {
            "default": "https://i.ytimg.com/vi/5gJkRXxFkcM/default.jpg",
            "medium": "https://i.ytimg.com/vi/5gJkRXxFkcM/mqdefault.jpg",
            "high": "https://i.ytimg.com/vi/5gJkRXxFkcM/hqdefault.jpg"
          },
          "addedBy": {},
          "createdAt": 1670159663652,
          "length": "3:20"
        },
        {
          "id": "gWMeV3xXuDQ",
          "title": "עדן אלנה - Eden Alene - Feker Libi - השיר של ישראל לאירוויזיון 2020!",
          "youtubeId": "gWMeV3xXuDQ",
          "imgUrl": {
            "default": "https://i.ytimg.com/vi/gWMeV3xXuDQ/default.jpg",
            "medium": "https://i.ytimg.com/vi/gWMeV3xXuDQ/mqdefault.jpg",
            "high": "https://i.ytimg.com/vi/gWMeV3xXuDQ/hqdefault.jpg"
          },
          "addedBy": {},
          "createdAt": 1670159663655,
          "length": "3:09"
        },
        {
          "id": "kmW2yAYhMmM",
          "title": "The Idan Raichel Project - הפרויקט של עידן רייכל - ממעמקים",
          "youtubeId": "kmW2yAYhMmM",
          "imgUrl": {
            "default": "https://i.ytimg.com/vi/kmW2yAYhMmM/default.jpg",
            "medium": "https://i.ytimg.com/vi/kmW2yAYhMmM/mqdefault.jpg",
            "high": "https://i.ytimg.com/vi/kmW2yAYhMmM/hqdefault.jpg"
          },
          "addedBy": {},
          "createdAt": 1670159703614,
          "length": "4:48"
        },
        {
          "id": "h_ChoT-AFkQ",
          "title": "The Idan Raichel Project - Halomot (Other People's Dreams)",
          "youtubeId": "h_ChoT-AFkQ",
          "imgUrl": {
            "default": "https://i.ytimg.com/vi/h_ChoT-AFkQ/default.jpg",
            "medium": "https://i.ytimg.com/vi/h_ChoT-AFkQ/mqdefault.jpg",
            "high": "https://i.ytimg.com/vi/h_ChoT-AFkQ/hqdefault.jpg"
          },
          "addedBy": {},
          "createdAt": 1670159703616,
          "length": "3:47"
        },
        {
          "id": "gZJLYd1TIsU",
          "title": "Idan Raichel - At (You) - עידן רייכל - את",
          "youtubeId": "gZJLYd1TIsU",
          "imgUrl": {
            "default": "https://i.ytimg.com/vi/gZJLYd1TIsU/default.jpg",
            "medium": "https://i.ytimg.com/vi/gZJLYd1TIsU/mqdefault.jpg",
            "high": "https://i.ytimg.com/vi/gZJLYd1TIsU/hqdefault.jpg"
          },
          "addedBy": {},
          "createdAt": 1670159703616,
          "length": "3:12"
        }
      ],
      "followers": [],
      "owner": {
        "username": "ilan",
        "password": "123",
        "fullname": "ilan",
        "stations": [
          {
            "_id": "SkAsV",
            "name": "This Is JuiceWRLD",
            "owner": "ilan"
          }
        ],
        "likedSongs": [],
        "_id": "kiH1V"
      },
      "_id": "TNm4g",
      "imgUrl": "http://res.cloudinary.com/casep22/image/upload/v1670159423/%D7%9C%D7%94%D7%99%D7%98%D7%99%D7%99%D7%A9%D7%A8%D7%90%D7%9C_nsow1a.jpg"
    },
    {
      "name": "This Is JuiceWRLD",
      "songs": [
        {
          "id": "mzB1VGEGcSU",
          "title": "Juice WRLD - Lucid Dreams (Directed by Cole Bennett)",
          "youtubeId": "mzB1VGEGcSU",
          "imgUrl": {
            "default": "https://i.ytimg.com/vi/mzB1VGEGcSU/default.jpg",
            "medium": "https://i.ytimg.com/vi/mzB1VGEGcSU/mqdefault.jpg",
            "high": "https://i.ytimg.com/vi/mzB1VGEGcSU/hqdefault.jpg"
          },
          "addedBy": {},
          "createdAt": 1670148075720,
          "length": "3:51"
        },
        {
          "id": "iI34LYmJ1Fs",
          "title": "Juice WRLD - Robbery (Directed by Cole Bennett)",
          "youtubeId": "iI34LYmJ1Fs",
          "imgUrl": {
            "default": "https://i.ytimg.com/vi/iI34LYmJ1Fs/default.jpg",
            "medium": "https://i.ytimg.com/vi/iI34LYmJ1Fs/mqdefault.jpg",
            "high": "https://i.ytimg.com/vi/iI34LYmJ1Fs/hqdefault.jpg"
          },
          "addedBy": {},
          "createdAt": 1670148981371,
          "length": "3:38"
        }
      ],
      "followers": [],
      "owner": {
        "username": "ilan",
        "password": "123",
        "fullname": "ilan",
        "stations": [],
        "likedSongs": [],
        "_id": "kiH1V"
      },
      "_id": "SkAsV",
      "imgUrl": "http://res.cloudinary.com/casep22/image/upload/v1670148061/jw_f796t2.jpg"
    },
  ]
// // TEST DATA

    if(!localStorage.getItem(STORAGE_KEY) || !localStorage.getItem(STORAGE_KEY).length){
        localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
    }
