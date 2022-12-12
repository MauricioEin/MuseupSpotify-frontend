import axios from 'axios'

const BASE_URL = process.env.NODE_ENV === 'production'
  ? '/api/'
  : '//localhost:3030/api/'

export const getLyrics = async songTitle => {
  try {
    const res = await axios.get(BASE_URL + 'car/lyrics?q=' + songTitle)
    const lyrics = res.data
    console.log('lyrics:\n', lyrics)
    return lyrics
  } catch (err) {
    console.error('ERROR!', err)
  }
}

