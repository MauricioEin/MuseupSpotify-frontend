import axios from 'axios'

const BASE_URL = process.env.NODE_ENV === 'production'
  ? '/api/'
  : '//localhost:3030/api/'

const API_KEYS = [
  '1e917d5048f6cfb7320715ab04aad672',
  '4e363a325cb491b46e4c3c11b59c8cb7',
  'fd570e639221de7111ff1ea46aa6dbde',
]
let keyIdx = 0

export const getLyrics = async songTitle => {
  try {
    const res = await axios.get(BASE_URL + `lyrics?q=${songTitle}&apikey=${API_KEYS[keyIdx]}`)
    const lyrics = res.data
    return lyrics
  } catch (err) {
    console.error('ERROR:', err)
    keyIdx++
    if (keyIdx >= API_KEYS.length) {
      throw err
    }
    const lyrics = getLyrics(songTitle)
    return lyrics || ''
  }
}

