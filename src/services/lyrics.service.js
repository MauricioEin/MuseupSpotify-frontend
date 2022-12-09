import axios from 'axios'

export const getLyrics = async songTitle => {


  console.log('got to service with', songTitle)


  try {
    const res = await axios.get('http://localhost:3030/api/car/lyrics?q=' + songTitle)
    const lyrics = res.data
    console.log('lyrics:\n',lyrics)
    return lyrics
  } catch (err) {
    console.error('ERROR!', err)
  }
}

